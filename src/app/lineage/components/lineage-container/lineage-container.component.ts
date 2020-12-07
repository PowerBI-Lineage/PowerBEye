import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ForceGraph3D from '3d-force-graph';
import { Workspace, Report, Dataset } from '../../models';
import { Link, Node, NodeType } from '../../models/graphModels';

@Component({
  selector: 'lineage-container',
  templateUrl: './lineage-container.component.html',
  styleUrls: ['./lineage-container.component.less']
})
export class LineageContainerComponent implements OnInit {

  public workspaces: Workspace[];
  public nodes: Node[] = [];
  public links: Link[] = [];
  public reports: Report[] = [];
  public datasets: Dataset[] = [];

  @ViewChild('filesInput', { static: true }) filesInput: ElementRef;

  constructor() { }

  ngOnInit(): void {

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

  private loadLineage(): void {

    //Traversing all workspaces
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
              target: datasetNode.id
            });
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
              target: dataflowNode.id
            });
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
              target: reportNode.id
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
              target: dashboardNode.id
            });
          }
      }

    //Creating cross workspace connections
    //Reports to datasets
    for (const report of this.reports) {
      const reportDatasetNode = this.datasets.find(dataset => dataset.id === report.datasetId);
      if (reportDatasetNode) {
        const datasetWorkspaceId = reportDatasetNode.workspaceId;
        if (report.workspaceId != datasetWorkspaceId) {
          this.links.push({
            source: datasetWorkspaceId,
            target: report.workspaceId
          });
        }
      }
    }

    //Datasets to dataflows

    //Dataflows to dataflows


      const gData = {
        nodes: this.nodes,
        links: this.links
      };

      const Graph = ForceGraph3D()
        (document.getElementById('3d-graph'))
          .graphData(gData)
          .dagMode('lr')
          .dagLevelDistance(500)
          .onNodeClick((node: any) => {
            if (node.type === NodeType.Workspace) {
              window.open(`https://powerbi-idog.analysis.windows-int.net/groups/${node.id}/lineage`, '_blank');
            }
          })
          .nodeColor((node: any) => {
            switch (node.type as NodeType) {
              case NodeType.Workspace: {
                return 'rgb(255,0,0,1)';
              }
              case NodeType.Dashboard: {
                return 'rgba(255,160,0,0.8)';
              }
              case NodeType.Report: {
                return 'rgba(0,255,255,0.6)';
              }
              case NodeType.Dataset: {
                return 'rgba(255,100,0,0.8)';
              }
              case NodeType.Dataflow: {
                return 'rgba(125,160,0,0.8)';
              }
              default: {
                return 'rgb(0,0,0,0)';
              }
            }
          });
  }
}
