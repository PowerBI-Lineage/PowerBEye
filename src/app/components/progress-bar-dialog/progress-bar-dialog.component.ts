import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { HomeProxy } from '../../home/services/home-proxy.service';

@Component({
  selector: 'progress-bar-dialog',
  templateUrl: './progress-bar-dialog.component.html',
  styleUrls: ['./progress-bar-dialog.component.less']
})
export class ProgressBarDialogComponent implements OnInit {
  public scanInfoStatusByScanId: { [scanInfoId: string]: string } = {};
  public scanStatusPercent: number = 0;
  public isScanTenantInProgress: boolean = true;

  constructor (private dialogRef: MatDialogRef<ProgressBarDialogComponent>,
    private proxy: HomeProxy) { }

  public ngOnInit (): void {
    this.updateStatus();
  }

  private updateStatus () {
    this.proxy.getScanInfoStatusChanged().subscribe((scanInfoStatusByScanId: { [scanInfoId: string]: string }) => {
      this.scanInfoStatusByScanId = scanInfoStatusByScanId;
      const numberOfRequests = Object.keys(scanInfoStatusByScanId).length;
      let numberOfSuccessRequests = 0;
      for (const [scanInfoId, scanInfoStatus] of Object.entries(scanInfoStatusByScanId)) {
        if (scanInfoStatus === 'Succeeded') {
          numberOfSuccessRequests++;
        }
      }
      this.scanStatusPercent = Math.round((numberOfSuccessRequests / numberOfRequests) * 100);
      this.isScanTenantInProgress = this.scanStatusPercent < 100;
      this.proxy.finishScan(this.scanStatusPercent >= 100);
    });
  }

  public closeDialog () {
    this.proxy.stopScan();
    this.scanStatusPercent = 0;
    this.isScanTenantInProgress = false;
    this.dialogRef.close();
  }

  public showVisualization () {
    this.dialogRef.close();
  }

  public downloadJson () {
    const observables = [];

    for (const [scanInfoId, scanInfoStatus] of Object.entries(this.scanInfoStatusByScanId)) {
      if (scanInfoStatus === 'Succeeded') {
        observables.push(this.proxy.getWorkspacesScanResult(scanInfoId));
      }
    }

    forkJoin(observables).pipe(take(1)).subscribe(arrayResult => {
      const result = { workspaces: [] };
      arrayResult.forEach((resultScanner: any) => {
        result.workspaces = [...result.workspaces, ...resultScanner.workspaces];
      });

      this.proxy.saveAsFile(JSON.stringify(result), 'workspaces' + 'liad' + '.JSON', 'text/plain;charset=utf-8');
    });
  }
}
