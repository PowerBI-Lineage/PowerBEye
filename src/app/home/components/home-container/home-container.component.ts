import { Component, OnInit } from '@angular/core';
import { ScanInfo } from '../../models';
import { HomeProxy } from '../../services/home-proxy.service';

declare var saveAs: any;

@Component({
  selector: 'home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.less']
})
export class HomeContainerComponent implements OnInit {

  public scanInfo: ScanInfo;

  constructor(private proxy: HomeProxy) { }

  ngOnInit(): void {
  }

  public startScan(): void {
    // tslint:disable-next-line: deprecation
    // tslint:disable-next-line: no-shadowed-variable
    const result = this.proxy.getModifedWorkspaces().subscribe(result => {
      console.log(result);
      const workspacesIds = result.map(workspace => workspace.Id);
      this.proxy.getWorkspacesLineage(workspacesIds).subscribe(lineageResult => {
        this.scanInfo = lineageResult;
      });
    });
  }

  public getStatus(): void {
    this.proxy.getWorkspacesScanStatus(this.scanInfo.id).subscribe(result => {
      console.log(result);
      this.scanInfo = result;
    });
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

  private saveAsFile(t: any, f: any, m: any): void {
      try {
          const b = new Blob([t],{type: m});
          saveAs(b, f);
      } catch (e) {
          window.open('data:' + m + ',' + encodeURIComponent(t), '_blank', '');
      }
  }
}
