import { Component, OnInit } from '@angular/core';
import { ScanInfo } from '../../models';
import { HomeProxy } from '../../services/home-proxy.service';
import { Router } from '@angular/router';

declare var saveAs: any;

@Component({
  selector: 'home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.less']
})
export class HomeContainerComponent implements OnInit {

  public scanInfo: ScanInfo;

  constructor(private proxy: HomeProxy,
              private router: Router) { }

  ngOnInit(): void {
  }

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

  public handleLineageNavigation(): void {
    this.router.navigate(['/lineage'], { queryParamsHandling: 'preserve' });
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
