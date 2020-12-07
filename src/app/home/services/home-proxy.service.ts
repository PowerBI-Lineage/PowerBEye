import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const EdogModifedWorkspaces = 'https://biazure-int-edog-redirect.analysis-df.windows.net/v1.0/myorg/admin/workspaces/modified';

@Injectable()
export class HomeProxy {
  constructor(private httpService: HttpClient) { }

    public getModifedWorkspaces(): Observable<any> {
      return this.httpService.get(EdogModifedWorkspaces);
    }
}
