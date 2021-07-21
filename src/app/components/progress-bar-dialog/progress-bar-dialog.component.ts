import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ScanService } from 'src/app/home/services/scan.service';
import { HomeProxy } from '../../home/services/home-proxy.service';

@Component({
  selector: 'progress-bar-dialog',
  templateUrl: './progress-bar-dialog.component.html',
  styleUrls: ['./progress-bar-dialog.component.less']
})
export class ProgressBarDialogComponent implements OnInit, OnDestroy {
  public scanInfoStatusByScanId: { [scanInfoId: string]: string } = {};
  public scanStatusPercent: number = 0;
  public isScanTenantInProgress: boolean = true;
  private destroy$: Subject<void> = new Subject();

  constructor (private dialogRef: MatDialogRef<ProgressBarDialogComponent>,
    private scanService: ScanService) {
    this.dialogRef.disableClose = true;
  }

  public ngOnInit (): void {
    this.updateStatus();
  }

  public ngOnDestroy (): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateStatus () {
    this.scanService.getScanInfoStatusChanged().pipe(
      takeUntil(this.destroy$))
      .subscribe((scanInfoStatusByScanId: { [scanInfoId: string]: string }) => {
        this.scanInfoStatusByScanId = scanInfoStatusByScanId;
        const numberOfRequests = Object.keys(scanInfoStatusByScanId).length;
        let numberOfSuccessRequests = 0;
        for (const [scanInfoId, scanInfoStatus] of Object.entries(scanInfoStatusByScanId)) {
          if (scanInfoStatus === 'Succeeded') {
            numberOfSuccessRequests++;
          }
        }
        this.scanStatusPercent = Math.round((numberOfSuccessRequests / numberOfRequests) * 100) || 0;
        this.isScanTenantInProgress = this.scanStatusPercent < 100;
        if (!this.isScanTenantInProgress) {
          setTimeout(() => {
            this.downloadJson();
            this.closeDialog();
          }, 1000);
        }
      });
  }

  public closeDialog () {
    this.scanStatusPercent = 0;
    this.isScanTenantInProgress = false;
    this.scanService.stopScan();
    this.destroy$.next();
    this.scanService.initScanInfoStatusChanged();
    this.dialogRef.close();
  }

  public showVisualization () {
    this.closeDialog();
    this.scanService.loadLineage(this.scanInfoStatusByScanId);
  }

  public downloadJson () {
    this.scanService.downloadJson(this.scanInfoStatusByScanId);
  }
}
