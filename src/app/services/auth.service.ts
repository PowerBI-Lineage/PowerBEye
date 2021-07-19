import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public tokenUpdate: BehaviorSubject<string> = new BehaviorSubject('');;

  constructor () { }

  public setToken (token: string) {
    this.tokenUpdate.next(token);
  }

  public getToken (): Observable<string> {
    return this.tokenUpdate.asObservable();
  }
}
