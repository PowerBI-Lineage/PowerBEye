import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.less']
})
export class LoginDialogComponent {

  public token: string;

  constructor(private authService: AuthService) {}

  public onClick(): void {
    this.authService.token = this.token;
  }

}
