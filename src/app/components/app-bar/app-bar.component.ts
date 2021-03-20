import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';

const Login: string = "login";
const Welcome: string = "Welcome";

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.less']
})
export class AppBarComponent {

  public welcomeSTR: string;

  constructor(private dialog: MatDialog,
              private authService: AuthService) {
    this.welcomeSTR = Login;

    this.authService.getToken().subscribe((token: string) => {
      const parsedToken = this.parseJwt(token);
      if (parsedToken !== null && parsedToken.name) {
          this.welcomeSTR = Welcome + " " + parsedToken.name;
      } else {
        this.welcomeSTR = Login;
      }
    })
  }

  public handleHomeNavigation(): void {
    location.reload();
  }

  public openDialog() {
    this.dialog.open(LoginDialogComponent);
  }

  public parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
}
