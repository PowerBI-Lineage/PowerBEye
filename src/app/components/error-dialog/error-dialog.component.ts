import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ScanService } from 'src/app/home/services/scan.service';
import { HomeProxy } from '../../home/services/home-proxy.service';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.less']
})
export class ErrorDialogComponent implements OnInit, OnDestroy {
  public title: string = '';
  public button: string = '';
  public errorMessage: string = '';
  public scanStatusPercent: number = 0;
  public isScanTenantInProgress: boolean = true;
  private destroy$: Subject<void> = new Subject();

  constructor(private dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.dialogRef.disableClose = true;
    this.title = data.title;
    this.button = data.button;
    this.errorMessage = data.errorMessage;
  }

  public ngOnInit(): void {

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public closeDialog() {
    this.destroy$.next();
    this.dialogRef.close();
  }
}
