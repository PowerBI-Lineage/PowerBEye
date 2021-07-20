import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { HomeProxy } from 'src/app/home/services/home-proxy.service';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';
declare let saveAs: any;

@Injectable({ providedIn: 'root' })
export class ScanService {
  private latestWorkspacesResult: any;
  public shouldStopScan: boolean = false;
  private scanInfoStatusChanged$: BehaviorSubject<{ [scanInfoId: string]: string }> = new BehaviorSubject({});
  private loadLineage$: BehaviorSubject<any> = new BehaviorSubject([]);
  public scanInfoStatusByScanId: { [scanInfoId: string]: string } = {};

  constructor(private proxy: HomeProxy) { }

  public stopScan(): void {
    this.shouldStopScan = true;
    this.scanInfoStatusChanged$ = new BehaviorSubject({});
    this.scanInfoStatusByScanId = {};
  }

  public getLoadLineage(): Observable<any> {
    return this.loadLineage$.asObservable();
  }

  public loadLineage(scanInfoStatusByScanId: { [scanInfoId: string]: string }): void {
    if (this.latestWorkspacesResult) {
      this.loadLineage$.next(this.latestWorkspacesResult);
    } else {
      this.getWorkspacesResult(scanInfoStatusByScanId).pipe(take(1)).subscribe(result => {
        this.loadLineage$.next(result);
      });
    }
  }

  public getScanInfoStatusChanged(): Observable<{ [scanInfoId: string]: string }> {
    return this.scanInfoStatusChanged$.asObservable();
  }

  public setScanInfoStatusChanged(value: { [scanInfoId: string]: string }): void {
    this.scanInfoStatusChanged$.next(value);
  }

  public initScanInfoStatusChanged(): void {
   
  }

  public downloadJson(scanInfoStatusByScanId: { [scanInfoId: string]: string }) {
    this.getWorkspacesResult(scanInfoStatusByScanId).pipe(take(1)).subscribe(result => {
      this.saveAsFile(JSON.stringify(result), `workspaces${(new Date().toJSON().slice(0, 10))}.JSON`, 'text/plain;charset=utf-8');
    });
  }

  public getWorkspacesResult(scanInfoStatusByScanId: { [scanInfoId: string]: string }) {
    const observables = [];

    for (const [scanInfoId, scanInfoStatus] of Object.entries(scanInfoStatusByScanId)) {
      if (scanInfoStatus === 'Succeeded') {
        observables.push(this.proxy.getWorkspacesScanResult(scanInfoId));
      }
    }

    return forkJoin(observables).pipe(take(1)).pipe(map(arrayResult => {
      const result = { workspaces: [] };
      arrayResult.forEach((resultScanner: any) => {
        result.workspaces = [...result.workspaces, ...resultScanner.workspaces];
      });
      this.latestWorkspacesResult = result;
      return result;
    }));
  }

  public saveAsFile(t: any, f: any, m: any): void {
    try {
      const b = new Blob([t], { type: m });
      saveAs(b, f);
    } catch (e) {
      window.open('data:' + m + ',' + encodeURIComponent(t), '_blank', '');
    }
  }
}
