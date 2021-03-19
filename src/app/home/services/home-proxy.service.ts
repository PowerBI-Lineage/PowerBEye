import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HomeProxy {
  constructor(private httpService: HttpClient) { }

    public async getModifedWorkspaces(): Promise<Observable<any>> {
      const req = {
        method: 'GET',
        url: 'https://wabi-staging-us-east-redirect.analysis.windows.net/v1.0/myorg/admin/workspaces/modified',
        headers: {
          'Content-Type': 'application/json',
          authorization: ''
        },
      };

      return this.httpService.get(req.url, req);
    }

    public getWorkspacesInfo(workspaceArray: string[]): Observable<any> {
      const req = {
        method: 'POST',
        url: 'https://wabi-staging-us-east-redirect.analysis.windows.net/v1.0/myorg/admin/workspaces/getInfo?lineage=true',
        headers: {
          authorization: ''
        },
      };

      return this.httpService.post(req.url, {workspaces: workspaceArray}, req);
    }

    public getWorkspacesScanStatus(scanId: string): Observable<any> {
      const req = {
        method: 'GET',
        url: `https://wabi-staging-us-east-redirect.analysis.windows.net/v1.0/myorg/admin/workspaces/scanStatus/${scanId}`,
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
        url: `https://wabi-staging-us-east-redirect.analysis.windows.net/v1.0/myorg/admin/workspaces/scanResult/${scanId}`,
        headers: {
          'Content-Type': 'application/json',
          authorization: ''
        },
      };

      return this.httpService.get(req.url, req);
    }
}
