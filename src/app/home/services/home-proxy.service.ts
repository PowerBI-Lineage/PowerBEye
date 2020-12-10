import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

@Injectable()
export class HomeProxy {
  constructor(private httpService: HttpClient,
              private authService: MsalService) { }

   baseUriDxt = 'https://wabi-staging-us-east-redirect.analysis.windows.net/v1.0/myorg/admin/workspaces/';
   baseUriEdog = 'https://biazure-int-edog-redirect.analysis-df.windows.net/v1.0/myorg/admin/workspaces/';
   //const baseUriProd = 'https://api.powrbi.com/v1.0/myorg/admin/workspaces/';
   baseUri = this.baseUriEdog;
   authHeader = 'Bearer ' + '[Enter token here]';

    public async getModifedWorkspaces(): Promise<Observable<any>> {

       /*const requestObj = {
         scopes: ['https://analysis.windows.net/powerbi/api/Tenant.Read.All'],
         extraScopesToConsent: ['https://analysis.windows.net/powerbi/api/Tenant.Read.All'],
         redirectUri: 'http://localhost:4200',
       };*/

       // const res = await this.authService.acquireTokenPopup(requestObj);
      //     // Callback code here
      // console.log(res.accessToken);

      const req = {
        method: 'GET',
        url: this.baseUri + 'modified',
        headers: {
          'Content-Type': 'application/json',
          authorization: this.authHeader
        },
      };

      return this.httpService.get(req.url, req);
    }

    public getWorkspacesLineage(workspaceArray: string[]): Observable<any> {
      const req = {
        method: 'POST',
        url: this.baseUri + 'getInfo?lineage=true',
        headers: {
          authorization: this.authHeader
        },
      };

      return this.httpService.post(req.url, {workspaces: workspaceArray}, req);
    }

    public getWorkspacesScanStatus(scanId: string): Observable<any> {
      const req = {
        method: 'GET',
        url: this.baseUri + `scanStatus/${scanId}`,
        headers: {
          'Content-Type': 'application/json',
          authorization: this.authHeader
        },
      };

      return this.httpService.get(req.url, req);
    }

    public getWorkspacesScanResult(scanId: string): Observable<any> {
      const req = {
        method: 'GET',
        url: this.baseUri +`scanResult/${scanId}`,
        headers: {
          'Content-Type': 'application/json',
          authorization: this.authHeader
        },
      };

      return this.httpService.get(req.url, req);
    }
}
