import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HomeProxy {
  constructor(private httpService: HttpClient) { }

    public getModifedWorkspaces(): Observable<any> {
      const req = {
        method: 'GET',
        url: 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/modified',
        headers: {
          'Content-Type': 'application/json',
          authorization: ''
        },
      };

      return this.httpService.get(req.url, req);
    }

    public getWorkspacesLineage(workspaceArray: string[]): Observable<any> {
      const req = {
        method: 'POST',
        url: 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo?lineage=true',
        headers: {
          authorization: ''
        },
      };

      return this.httpService.post(req.url, {workspaces: workspaceArray}, req);
    }

    public getWorkspacesScanStatus(scanId: string): Observable<any> {
      const req = {
        method: 'GET',
        url: `https://api.powerbi.com/v1.0/myorg/admin/workspaces/scanStatus/${scanId}`,
        headers: {
          'Content-Type': 'application/json',
          authorization: ''
        },
      };

      return this.httpService.get(req.url, req);
    }

    public getWorkspacesScanResult(scanId: string): Observable<any> {
      const req = {
        method: 'GET',
        url: `https://api.powerbi.com/v1.0/myorg/admin/workspaces/scanResult/${scanId}`,
        headers: {
          'Content-Type': 'application/json',
          authorization: ''
        },
      };

      return this.httpService.get(req.url, req);
    }
}
