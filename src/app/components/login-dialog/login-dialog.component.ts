import { Component } from '@angular/core';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.less']
})
export class LoginDialogComponent {

  public token: string;

  constructor() {}

  public onClick(): void {
    console.log(this.token);
  }

}
