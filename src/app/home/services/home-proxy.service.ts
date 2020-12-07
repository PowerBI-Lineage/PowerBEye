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
          authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYjA4ZThhOTktNmQ2Ni00NjYwLWI3MDktZDhiMTZkNWY4ZTI4LyIsImlhdCI6MTYwNzM2ODE3MywibmJmIjoxNjA3MzY4MTczLCJleHAiOjE2MDczNzIwNzMsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84UkFBQUEwaG5EcFpXWkFMd2RRRlJFRkZTMTQ1S3I2Nmk3RENnYVpIL1Fjc3Z4MkpCSVRERTY3blluSThyek53MHVKZStwIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMiIsImlwYWRkciI6IjM3LjE0Mi40LjExNSIsIm5hbWUiOiJhZG1pbiIsIm9pZCI6IjM4ZjAxZmM4LTg5MjQtNGQ5NC1iMzdlLTA0NDRhMGU4NzBkMiIsInB1aWQiOiIxMDAzMjAwMDU2OUMwRDEwIiwicmgiOiIwLkFUWUFtWXFPc0dadFlFYTNDZGl4YlYtT0tBOEJISWRoWHJGUGc2eVlZUXAta1JBMkFFWS4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiI0WEZTNVVJTmFJZXRlTTFqTGZRQ3ZsNGxiVFZwSjBrbHVfM3FOUV94NUprIiwidGlkIjoiYjA4ZThhOTktNmQ2Ni00NjYwLWI3MDktZDhiMTZkNWY4ZTI4IiwidW5pcXVlX25hbWUiOiJhZG1pbkBFSU1DYXRhbG9nRHh0MDEub25taWNyb3NvZnQuY29tIiwidXBuIjoiYWRtaW5ARUlNQ2F0YWxvZ0R4dDAxLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjNoM2ZkWm9mb1VlQi1fWWxCeDdrQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.TKGlmblHkLSb7u86Axj5Ii0DzEVPZXdgJzNpwhj0hzMMVLoxGBKTIHaGKffFBLTbCxMfMHGD68Prb-O0GB7D9qY3HZOrEfKlD659HBI--90DLQxgyYk03tIS6oXrwvlhniZ-6Wr2JKIIRiRSJcQKNbFbgdPjhTp1jM3BT2XDSdpB8Z9Xd-giznaLzQVIWjILqL_oJ4juZqSoBhmkPJiKJkJeVzLP3Ex06xLePTpg_ST5Y48GZmykBYjO5RtZucp67M9zbLIdePA65G8hYfeZyPdiuxu3vjf2JssbSjpr_rxuaKUyc6c7_GqWVME1Wme73RzCKWdrUVmSGCevi8Byyg'
        },
      };

      return this.httpService.get(req.url, req);
    }

    public getWorkspacesLineage(workspaceArray: string[]): Observable<any> {
      const req = {
        method: 'POST',
        url: 'https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo?lineage=true',
        headers: {
          authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYjA4ZThhOTktNmQ2Ni00NjYwLWI3MDktZDhiMTZkNWY4ZTI4LyIsImlhdCI6MTYwNzM2ODE3MywibmJmIjoxNjA3MzY4MTczLCJleHAiOjE2MDczNzIwNzMsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84UkFBQUEwaG5EcFpXWkFMd2RRRlJFRkZTMTQ1S3I2Nmk3RENnYVpIL1Fjc3Z4MkpCSVRERTY3blluSThyek53MHVKZStwIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMiIsImlwYWRkciI6IjM3LjE0Mi40LjExNSIsIm5hbWUiOiJhZG1pbiIsIm9pZCI6IjM4ZjAxZmM4LTg5MjQtNGQ5NC1iMzdlLTA0NDRhMGU4NzBkMiIsInB1aWQiOiIxMDAzMjAwMDU2OUMwRDEwIiwicmgiOiIwLkFUWUFtWXFPc0dadFlFYTNDZGl4YlYtT0tBOEJISWRoWHJGUGc2eVlZUXAta1JBMkFFWS4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiI0WEZTNVVJTmFJZXRlTTFqTGZRQ3ZsNGxiVFZwSjBrbHVfM3FOUV94NUprIiwidGlkIjoiYjA4ZThhOTktNmQ2Ni00NjYwLWI3MDktZDhiMTZkNWY4ZTI4IiwidW5pcXVlX25hbWUiOiJhZG1pbkBFSU1DYXRhbG9nRHh0MDEub25taWNyb3NvZnQuY29tIiwidXBuIjoiYWRtaW5ARUlNQ2F0YWxvZ0R4dDAxLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjNoM2ZkWm9mb1VlQi1fWWxCeDdrQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.TKGlmblHkLSb7u86Axj5Ii0DzEVPZXdgJzNpwhj0hzMMVLoxGBKTIHaGKffFBLTbCxMfMHGD68Prb-O0GB7D9qY3HZOrEfKlD659HBI--90DLQxgyYk03tIS6oXrwvlhniZ-6Wr2JKIIRiRSJcQKNbFbgdPjhTp1jM3BT2XDSdpB8Z9Xd-giznaLzQVIWjILqL_oJ4juZqSoBhmkPJiKJkJeVzLP3Ex06xLePTpg_ST5Y48GZmykBYjO5RtZucp67M9zbLIdePA65G8hYfeZyPdiuxu3vjf2JssbSjpr_rxuaKUyc6c7_GqWVME1Wme73RzCKWdrUVmSGCevi8Byyg'
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
          authorization: 'Bearer'
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
          authorization: 'Bearer '
        },
      };

      return this.httpService.get(req.url, req);
    }
}
