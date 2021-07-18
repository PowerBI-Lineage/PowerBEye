import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
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
    const apiUrl: string = this.getEnvironment();

    const req = {
      method: 'GET',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/modified?excludePersonalWorkspaces=false`,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.token,
      },
    };

    return this.httpService.get(req.url, req);
  }

  public getWorkspacesInfo(workspaceArray: string[]): Observable<any> {
    const apiUrl: string = this.getEnvironment();
    const req = {
      method: 'POST',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/getInfo?lineage=true`,
      headers: {
        authorization: 'Bearer ' + this.token,
      },
    };

    return this.httpService.post(req.url, { workspaces: workspaceArray }, req);
  }

  public getWorkspacesScanStatus(scanId: string): Observable<any> {
    const apiUrl: string = this.getEnvironment();
    const req = {
      method: 'GET',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/scanStatus/${scanId}`,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.token,
      },
    };

    return this.httpService.get(req.url, req);
  }

  public getWorkspacesScanResult(scanId: string): Observable<any> {
    const apiUrl: string = this.getEnvironment();
    const req = {
      method: 'GET',
      url: `https://${apiUrl}/v1.0/myorg/admin/workspaces/scanResult/${scanId}`,
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.token,
      },
    };

    return this.httpService.get(req.url, req);
  }

  private getEnvironment(): string {
    const env: string = this.route.snapshot.queryParams['env'];
    const envLowerCase: string = env ? env.toLocaleLowerCase() : env;
    switch (envLowerCase) {
      case 'edog':
      case 'idog': {
        return 'biazure-int-edog-redirect.analysis-df.windows.net';
      }
      case 'dxt': {
        return 'wabi-staging-us-east-redirect.analysis';
      }
      case 'msit':{
        return 'df-msit-scus-redirect.analysis.windows.net';
      }
      case 'prod':{
        return 'wabi-staging-us-east-redirect.analysis.windows.net';
      }
      default:
        return 'wabi-staging-us-east-redirect.analysis.windows.net';
    }
  }
}
