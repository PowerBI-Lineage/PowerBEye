import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.less']
})
export class LoginDialogComponent {
  public token: string;
  
  constructor (private authService: AuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>) { }

  public onClick (): void {
    this.authService.setToken(this.token);
  }

  public closeDialog () {
    this.dialogRef.close();
  }
}
