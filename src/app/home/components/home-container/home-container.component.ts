import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HomeProxy } from '../../services/home-proxy.service';
import { ScanService } from '../../services/scan.service';
import ForceGraph3D from '3d-force-graph';
import { Report, Dataset } from '../../models/dataModel';
import { Link, LinkType, Node, NodeType } from '../../models/graphModels';
import * as THREE from 'three';
import { AuthService } from 'src/app/services/auth.service';
import SpriteText from 'three-spritetext';
import { take, map, switchMap, takeUntil, filter } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressBarDialogComponent } from 'src/app/components/progress-bar-dialog/progress-bar-dialog.component';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';

const WorkspaceLimit: number = 2;
const maxParallelBEcalls: number = 16;

@Component({
  selector: 'home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.less']
})
export class HomeContainerComponent implements OnInit, OnDestroy {
  public isScanTenantInProgress: boolean = false;
  public shouldShowGraph = false;
  public nodes: Node[] = [];
  public links: Link[] = [];
  public reports: Report[] = [];
  public datasets: Dataset[] = [];

  public canStartScan: boolean = false;
  public scanInfoStatusByScanId: { [scanInfoId: string]: string } = {};
  public scanStatusPercent: number = 0;
  private progressBarDialogRef: MatDialogRef<ProgressBarDialogComponent>;
  private destroy$: Subject<void> = new Subject();

  @ViewChild('filesInput', { static: true }) filesInput: ElementRef;

  constructor(private proxy: HomeProxy,
    private scanService: ScanService,
    private authService: AuthService,
    private dialog: MatDialog) {
    this.authService.getToken().subscribe((token: string) => {
      this.canStartScan = token.length > 0;
    });
  }

  public ngOnInit(): void {
    this.scanService.getLoadLineage().pipe(
      takeUntil(this.destroy$),
    )
    .subscribe(workspaces => workspaces && workspaces.length > 0 ? this.loadLineage(workspaces) : null);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async startScan(): Promise<void> {
    if (!this.canStartScan) {
      this.dialog.open(LoginDialogComponent);
      return;
    }
    this.scanService.shouldStopScan = false;
    this.progressBarDialogRef = this.dialog.open(ProgressBarDialogComponent, {disableClose: true});
    this.isScanTenantInProgress = true;
    try {
      const resultObserable = await this.proxy.getModifedWorkspaces();
      const result = await resultObserable.toPromise();
      const workspacesIds = result.slice(0, maxParallelBEcalls * 100).map(workspace => workspace.Id);

      this.getWorkspacesScanFilesParallel(workspacesIds);

      this.isScanTenantInProgress = false;
    } catch (e) {
      switch (e.status) {
        case 401: {
          // TODO: show error "No tenant admin is logged in".
          alert('401 - No tenant admin is logged in');
          break;
        }
        case 403: {
          // TODO: show error "change the environment / refresh the token".
          alert('403 - change the environment / refresh the token');
          break;
        }
      }
      this.progressBarDialogRef.close();
      this.isScanTenantInProgress = false;
    }
  }

  public async getWorkspacesScanFiles(workspaceIds: string[]) {
    let scanInfo = await this.proxy.getWorkspacesInfo(workspaceIds).toPromise();

    while (scanInfo.status !== 'Succeeded') {
      if (this.scanService.shouldStopScan) {
        break;
      }
      this.scanInfoStatusByScanId[scanInfo.id] = scanInfo.status;
      this.scanService.setScanInfoStatusChanged(this.scanInfoStatusByScanId);
      await this.sleep(1000);
      scanInfo = await this.proxy.getWorkspacesScanStatus(scanInfo.id).toPromise();
    }
    this.scanInfoStatusByScanId[scanInfo.id] = scanInfo.status;
    this.scanService.setScanInfoStatusChanged(this.scanInfoStatusByScanId);
  }

  public sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public onAddFile(): void {
    if (this.isScanTenantInProgress) {
      return;
    }

    (this.filesInput.nativeElement as HTMLInputElement).click();
  }

  public onFileAdded(): void {
    const files = (this.filesInput.nativeElement as HTMLInputElement).files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.addEventListener('load', (event) => {
        const workspaces = JSON.parse(event.target.result as string).workspaces;
        this.loadLineage(workspaces);
      });

      reader.readAsText(file);
    }
  }

  private getNodeColor(nodeType: NodeType): string {
    switch (nodeType) {
      case NodeType.Workspace: {
        return 'rgb(255,0,0,1)';
      }
      case NodeType.Dashboard: {
        return 'rgba(25, 114, 120, 1)';
      }
      case NodeType.Report: {
        return 'rgba(18, 35, 158, 1)';
      }
      case NodeType.Dataset: {
        return 'rgba(201, 79, 15, 1)';
      }
      case NodeType.Dataflow: {
        return 'rgba(153, 112, 10, 1)';
      }
      default: {
        return 'rgb(0,0,0,0)';
      }
    }
  }

  private getNodeTypeImage(nodeType: NodeType): THREE.Mesh {
    let texture = null;

    switch (nodeType) {
      case NodeType.Dashboard: {
        texture = THREE.ImageUtils.loadTexture('assets/dashboard.png');
        break;
      }
      case NodeType.Report: {
        texture = THREE.ImageUtils.loadTexture('assets/report.png');
        break;
      }
      case NodeType.Dataset: {
        texture = THREE.ImageUtils.loadTexture('assets/dataset.png');
        break;
      }
      case NodeType.Dataflow: {
        texture = THREE.ImageUtils.loadTexture('assets/dataflow.png');
        break;
      }
      default: {
        texture = THREE.ImageUtils.loadTexture('assets/data source.png');
        break;
      }
    }

    const sphere = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshBasicMaterial({
        map: texture
      })
    );

    return sphere;
  }

  private loadLineage(workspaces): void {
    let numberOfWorkspaces = 0;
    // Traversing all workspaces
    for (const workspace of workspaces) {
      const workspaceNode: Node = {
        id: workspace.id,
        name: workspace.name,
        type: NodeType.Workspace,
        crossWSIds: [],
        workspaceId: workspace.id
      };
      this.nodes.push(workspaceNode);
      numberOfWorkspaces++;

      for (const dataset of workspace.datasets ?? []) {
        dataset.workspaceId = workspace.id;
        this.datasets.push(dataset);

        const datasetNode: Node = {
          id: dataset.id,
          name: dataset.name,
          type: NodeType.Dataset,
          workspaceId: workspace.id
        };
        this.nodes.push(datasetNode);
        this.links.push({
          source: workspaceNode.id,
          target: datasetNode.id,
          type: LinkType.Contains
        });

        if (dataset.upstreamDataflows) {
          for (const upstreamDataflow of dataset.upstreamDataflows) {
            if (upstreamDataflow.groupId !== dataset.workspaceId) {
              this.links.push({
                source: dataset.workspaceId,
                target: upstreamDataflow.groupId,
                type: LinkType.CrossWorkspace
              });
              workspaceNode.crossWSIds.push(upstreamDataflow.groupId);
            }
          }
        }
      }

      for (const dataflow of workspace.dataflows ?? []) {
        dataflow.workspaceId = workspace.id;
        const dataflowNode: Node = {
          id: dataflow.objectId,
          name: dataflow.name,
          type: NodeType.Dataflow,
          workspaceId: workspace.id
        };
        this.nodes.push(dataflowNode);
        this.links.push({
          source: workspaceNode.id,
          target: dataflowNode.id,
          type: LinkType.Contains
        });

        if (dataflow.upstreamDataflows) {
          for (const upstreamDataflow of dataflow.upstreamDataflows) {
            if (upstreamDataflow.groupId !== dataflow.workspaceId) {
              this.links.push({
                source: dataflow.workspaceId,
                target: upstreamDataflow.groupId,
                type: LinkType.CrossWorkspace
              });
            }
            workspaceNode.crossWSIds.push(dataflow.workspaceId);
          }
        }
      }

      for (const report of workspace.reports ?? []) {
        report.workspaceId = workspace.id;
        this.reports.push(report);

        const reportNode: Node = {
          id: report.id,
          name: report.name,
          type: NodeType.Report,
          workspaceId: workspace.id
        };
        this.nodes.push(reportNode);
        this.links.push({
          source: workspaceNode.id,
          target: reportNode.id,
          type: LinkType.Contains
        });
      }

      for (const dashboard of workspace.dashboards ?? []) {
        dashboard.workspaceId = workspace.id;
        const dashboardNode: Node = {
          id: dashboard.id,
          name: dashboard.displayName,
          type: NodeType.Dashboard,
          workspaceId: workspace.id
        };
        this.nodes.push(dashboardNode);
        this.links.push({
          source: workspaceNode.id,
          target: dashboardNode.id,
          type: LinkType.Contains
        });
      }
    }

    // Creating cross workspace connections between Reports and datasets
    for (const report of this.reports ?? []) {
      const reportDatasetNode = this.datasets.find(dataset => dataset.id === report.datasetId);
      if (reportDatasetNode) {
        const datasetWorkspaceId = reportDatasetNode.workspaceId;
        if (report.workspaceId !== datasetWorkspaceId) {
          this.links.push({
            source: report.workspaceId,
            target: datasetWorkspaceId,
            type: LinkType.CrossWorkspace
          });
          this.nodes.find(node => node.id === report.workspaceId).crossWSIds.push(datasetWorkspaceId);
        }
      }
    }

    // Need to clear references to workspaces that weren't encountered
    let validLinks: Link[] = this.links.filter(link => workspaces.find(workspace => workspace.id === link.source));

    // should reduce workspaces node
    if (numberOfWorkspaces > WorkspaceLimit) {
      const workspaceNodes = this.nodes.filter(node => node.type === NodeType.Workspace);
      const limitedWorkspaceInfo = workspaceNodes.sort(function (a, b) { return b.crossWSIds.length > a.crossWSIds.length ? 1 : -1; }).slice(0, WorkspaceLimit).map(node => {
        return {
          id: node.id,
          crossWSIds: node.crossWSIds
        };
      });

      let limitedWorkspaceNodes = [];
      for (const info of limitedWorkspaceInfo) {
        const node = this.nodes.find(limitedWorkspaceNode => limitedWorkspaceNode.id === info.id);
        if (!node) {
          continue;
        }
        limitedWorkspaceNodes.push(info.id);
        limitedWorkspaceNodes = [...new Set([...limitedWorkspaceNodes, ...info.crossWSIds])];
      }

      this.nodes = this.nodes.filter(node => limitedWorkspaceNodes.includes(node.workspaceId));
      const nodeIds = this.nodes.map(node => node.id);
      validLinks = validLinks.filter(link => nodeIds.includes(link.source) && nodeIds.includes(link.target));
    }

    const gData = {
      nodes: this.nodes,
      links: validLinks
    };

    ForceGraph3D({
      controlType: 'orbit'
    })(document.getElementById('3d-graph'))
      .graphData(gData)
      .enableNodeDrag(false)
      .onNodeClick((node: any) => {
        if (node.type === NodeType.Workspace) {
          const url: string = this.proxy.getEnvironment().url;
          window.open(`${url}/groups/${node.id}/lineage`, '_blank');
        }
      })
      .linkDirectionalParticles((link: any) => {
        if (link.type === LinkType.CrossWorkspace) {
          return 10;
        }
      })
      .linkDirectionalParticleSpeed(0.005)
      .linkDirectionalParticleWidth(3)
      .linkDirectionalParticleColor('rgba(18, 35, 158, 1)')
      .nodeThreeObject((node: any) => {
        if (node.type !== NodeType.Workspace) {
          return this.getNodeTypeImage(node.type as NodeType);
        }

        const sprite = new SpriteText(node.name);
        // sprite.material.depthWrite = false; // make sprite background transparent
        sprite.color = 'rgba(255,255,255,0.8)';
        sprite.textHeight = 15;
        return sprite;
      })
      .nodeColor((node: any) => {
        return this.getNodeColor(node.type as NodeType);
      });

    this.shouldShowGraph = true;
  }

  private async getWorkspacesScanFilesParallel(workspaceIds: string[]) {
    let index = 0;
    const observables = [];
    while (index < workspaceIds.length) {
      observables.push(this.getWorkspacesScanFiles(workspaceIds.slice(index, index + 100)));
      index += 100;
    }
    forkJoin(observables).pipe(take(1)).subscribe();
  }
}
