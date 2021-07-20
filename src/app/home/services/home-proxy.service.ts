import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
declare let saveAs: any;

@Injectable({ providedIn: 'root' })
export class HomeProxy {
  private token: string;

  constructor(private httpService: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.authService.getToken().subscribe((token: string) => {
      this.token = token.replace(/Bearer /g, '');
    });
  }

  public async getModifedWorkspaces(): Promise<Observable<any>> {
    const apiUrl: string = this.getEnvironment().apiUrl;

    const req = {
      method: 'GET',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/modified?excludePersonalWorkspaces=false`,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.token,
        'X-POWERBI-ADMIN-CLIENT-NAME': 'PowerBEye'
      }
    };

    return this.httpService.get(req.url, req);
  }

  public getWorkspacesInfo(workspaceArray: string[]): Observable<any> {
    const apiUrl: string = this.getEnvironment().apiUrl;
    const req = {
      method: 'POST',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/getInfo?lineage=true`,
      headers: {
        authorization: 'Bearer ' + this.token,
        'X-POWERBI-ADMIN-CLIENT-NAME': 'PowerBEye'
      }
    };

    return this.httpService.post(req.url, { workspaces: workspaceArray }, req);
  }

  public getWorkspacesScanStatus(scanId: string): Observable<any> {
    const apiUrl: string = this.getEnvironment().apiUrl;
    const req = {
      method: 'GET',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/scanStatus/${scanId}`,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.token
      }
    };

    return this.httpService.get(req.url, req);
  }

  public getWorkspacesScanResult(scanId: string): Observable<any> {
    const apiUrl: string = this.getEnvironment().apiUrl;
    const req = {
      method: 'GET',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/scanResult/${scanId}`,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.token
      }
    };

    return this.httpService.get(req.url, req);
  }

  public getEnvironment(): { apiUrl: string, url: string } {
    const env: string = this.route.snapshot.queryParams.env;
    const envLowerCase: string = env ? env.toLocaleLowerCase() : env;
    switch (envLowerCase) {
      case 'edog':
      case 'idog': {
        return {
          apiUrl: 'biazure-int-edog-redirect.analysis-df.windows.net',
          url: 'https://powerbi-idog.analysis.windows-int.net/'
        };
      }
      case 'dxt': {
        return {
          apiUrl: 'wabi-staging-us-east-redirect.analysis.windows.net',
          url: 'https://dxt.powerbi.com/'
        };
      }
      case 'msit': {
        return {
          apiUrl: 'df-msit-scus-redirect.analysis.windows.net',
          url: 'https://msit.powerbi.com'
        };
      }
      case 'prod': {
        return {
          apiUrl: 'wabi-staging-us-east-redirect.analysis.windows.net',
          url: 'https://app.powerbi.com/'
        };
      }
      default:
        return {
          apiUrl: 'wabi-staging-us-east-redirect.analysis.windows.net',
          url: 'https://app.powerbi.com/'
        };
    }
  }
}
