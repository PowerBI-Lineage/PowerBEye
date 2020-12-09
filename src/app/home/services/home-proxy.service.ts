import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

@Injectable()
export class HomeProxy {
  constructor(private httpService: HttpClient,
              private authService: MsalService) { }

    public async getModifedWorkspaces(): Promise<Observable<any>> {

      // const requestObj = {
      //   scopes: ['https://analysis.windows.net/powerbi/api/Tenant.Read.All'],
      //   extraScopesToConsent: ['https://analysis.windows.net/powerbi/api/Tenant.Read.All'],
      //   redirectUri: 'http://localhost:4200',
      // };

      // const res = await this.authService.acquireTokenPopup(requestObj);
      //     // Callback code here
      // console.log(res.accessToken);

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
