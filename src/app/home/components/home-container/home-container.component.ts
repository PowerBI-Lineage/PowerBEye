import { Component, ElementRef, ViewChild } from '@angular/core';
import { ScanInfo } from '../../models';
import { HomeProxy } from '../../services/home-proxy.service';
import { Router } from '@angular/router';
import ForceGraph3D from '3d-force-graph';
import { Workspace, Report, Dataset } from '../../models/dataModel';
import { Link, LinkType, Node, NodeType } from '../../models/graphModels';
import SpriteText from 'three-spritetext';
import * as THREE from 'three';

declare var saveAs: any;

@Component({
  selector: 'home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.less']
})
export class HomeContainerComponent {

  public scanInfo: ScanInfo;
  public shouldShowGraph = false;
  public workspaces: Workspace[];
  public nodes: Node[] = [];
  public links: Link[] = [];
  public reports: Report[] = [];
  public datasets: Dataset[] = [];

  @ViewChild('filesInput', { static: true }) filesInput: ElementRef;

  constructor(private proxy: HomeProxy,
              private router: Router) { }

  public async startScan(): Promise<void> {
    // tslint:disable-next-line: deprecation
    // tslint:disable-next-line: no-shadowed-variable
    const resultObserable = await this.proxy.getModifedWorkspaces();
    const result = await resultObserable.toPromise();

    const workspacesIds = result.map(workspace => workspace.Id);
    this.scanInfo = await this.proxy.getWorkspacesLineage(workspacesIds).toPromise();

    while (this.scanInfo.status !== 'Succeeded') {
      this.scanInfo = await this.proxy.getWorkspacesScanStatus(this.scanInfo.id).toPromise();
    }

    this.downloadFiles();
  }

  public downloadFiles(): void {
    if (this.scanInfo.status !== 'Succeeded') {
      return;
    }

    this.proxy.getWorkspacesScanResult(this.scanInfo.id).subscribe(result => {
      console.log(result);
      this.saveAsFile(JSON.stringify(result), 'workspace.JSON', 'text/plain;charset=utf-8');
    });
  }

  public onAddFile(): void {
    (this.filesInput.nativeElement as HTMLInputElement).click();
}

  public onFileAdded(): void {
    const files = (this.filesInput.nativeElement as HTMLInputElement).files;

    for (let i = 0 ; i < files.length ; i++) {
      const file = files [i];
      console.log(file);
      const reader = new FileReader();

      reader.addEventListener('load', (event) => {
        this.workspaces = JSON.parse(event.target.result as string).workspaces;
        this.loadLineage();
      });

      reader.readAsText(file);
    }
  }

  private getWorkspaceTextSize(id: string): number {
    const nodeWorkspace = this.workspaces.find(ws => ws.id === id);
    const artifactCount = nodeWorkspace.dashboards.length
    + nodeWorkspace.reports.length
    + nodeWorkspace.datasets.length
    + nodeWorkspace.dataflows.length;

    let textSize = 8;
    if (artifactCount > 10 && artifactCount <= 50) {
      textSize = 16;
    }
    if (artifactCount > 50 && artifactCount <= 100) {
      textSize = 22;
    }
    if (artifactCount > 100) {
      textSize = 30;
    }
    return textSize;
  }

  private getNodeColor(nodeType: NodeType) : string {
    /*
    Report (18, 35, 158, 1)
    Dashboard (25, 114, 120, 1)
    Dataset (201, 79, 15, 1)
    Dataflow (153, 112, 10, 1)
    App (70, 104, 197, 1)
    Workspace (182, 0, 100, 1)
    Workbook (33, 115, 70, 1)
    Data source (116, 78, 194, 1)
    */
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

  private getNodeTypeImage(nodeType: NodeType) : THREE.Mesh {
    let texture = null;

    switch (nodeType) {
      case NodeType.Dashboard: {
        texture = THREE.ImageUtils.loadTexture(`assets/dashboard.png`);
        break;
      }
      case NodeType.Report: {
        texture = THREE.ImageUtils.loadTexture(`assets/report.png`);
        break;
      }
      case NodeType.Dataset: {
        texture = THREE.ImageUtils.loadTexture(`assets/dataset.png`);
        break;
      }
      case NodeType.Dataflow: {
        texture = THREE.ImageUtils.loadTexture(`assets/dataflow.png`);
        break;
      }
      default: {
        texture = THREE.ImageUtils.loadTexture(`assets/data source.png`);
        break;
      }
    }

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(4),
      new THREE.MeshBasicMaterial({
        map: texture
      })
    );

    return sphere;
  }

  private loadLineage(): void {

    // Traversing all workspaces
      for (const workspace of this.workspaces) {
          const workspaceNode: Node = {
            id: workspace.id,
            name: workspace.name,
            type: NodeType.Workspace,
          };
          this.nodes.push(workspaceNode);

          for (const dataset of workspace.datasets) {
            dataset.workspaceId = workspace.id;
            this.datasets.push(dataset);

            const datasetNode: Node = {
              id: dataset.id,
              name: dataset.name,
              type: NodeType.Dataset,
            };
            this.nodes.push(datasetNode);
            this.links.push({
              source: workspaceNode.id,
              target: datasetNode.id,
              type: LinkType.Contains,
            });

            if (dataset.upstreamDataflows) {
              for (const upstreamDataflow of dataset.upstreamDataflows) {
                if (upstreamDataflow.groupId != dataset.workspaceId) {
                  this.links.push({
                    source: upstreamDataflow.groupId,
                    target: dataset.workspaceId,
                    type: LinkType.CrossWorkspace,
                  });
                }
              }
            }
          }

          for (const dataflow of workspace.dataflows) {
            dataflow.workspaceId= workspace.id;
            const dataflowNode: Node = {
              id: dataflow.objectId,
              name: dataflow.name,
              type: NodeType.Dataflow,
            };
            this.nodes.push(dataflowNode);
            this.links.push({
              source: workspaceNode.id,
              target: dataflowNode.id,
              type: LinkType.Contains
            });

            if (dataflow.upstreamDataflows) {
              for (const upstreamDataflow of dataflow.upstreamDataflows) {
                if (upstreamDataflow.groupId != dataflow.workspaceId) {
                  this.links.push({
                    source: upstreamDataflow.groupId,
                    target: dataflow.workspaceId,
                    type: LinkType.CrossWorkspace,
                  });
                }
              }
            }
          }

          for (const report of workspace.reports) {
            report.workspaceId = workspace.id;
            report.datasetId = report.datasetId;
            this.reports.push(report);

            const reportNode: Node = {
              id: report.id,
              name: report.name,
              type: NodeType.Report,
            };
            this.nodes.push(reportNode);
            this.links.push({
              source: workspaceNode.id,
              target: reportNode.id,
              type: LinkType.Contains
            });
          }

          for (const dashboard of workspace.dashboards) {
            dashboard.workspaceId = workspace.id;
            const dashboardNode: Node = {
              id: dashboard.id,
              name: dashboard.displayName,
              type: NodeType.Dashboard,
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
      for (const report of this.reports) {
      const reportDatasetNode = this.datasets.find(dataset => dataset.id === report.datasetId);
      if (reportDatasetNode) {
        const datasetWorkspaceId = reportDatasetNode.workspaceId;
        if (report.workspaceId !== datasetWorkspaceId) {
          this.links.push({
            source: datasetWorkspaceId,
            target: report.workspaceId,
            type: LinkType.CrossWorkspace,
          });
        }
      }
    }

    // Need to clear references to workspaces that weren't encountered
      const validLinks: Link[]=  this.links.filter(link=> this.workspaces.find(workspace => workspace.id === link.source));

      const gData = {
        nodes: this.nodes,
        links: validLinks
      };

      const Graph = ForceGraph3D()
        (document.getElementById('3d-graph'))
          .graphData(gData)
          .enableNodeDrag(false)
          .onNodeClick((node: any) => {
            if (node.type === NodeType.Workspace) {
              window.open(`https://powerbi-idog.analysis.windows-int.net/groups/${node.id}/lineage`, '_blank');
            }
          })
          .linkDirectionalParticles((link: any) =>{
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
            sprite.material.depthWrite = false; // make sprite background transparent
            sprite.color = 'rgba(255,255,255,0.8)';
            sprite.textHeight = 15;
            return sprite;
          })
          .nodeColor((node: any) => {
            return this.getNodeColor(node.type as NodeType);
          });

      this.shouldShowGraph = true;
    }

  private saveAsFile(t: any, f: any, m: any): void {
      try {
          const b = new Blob([t],{type: m});
          saveAs(b, f);
      } catch (e) {
          window.open('data:' + m + ',' + encodeURIComponent(t), '_blank', '');
      }
  }
}
