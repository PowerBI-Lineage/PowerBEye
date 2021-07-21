import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';

const Login: string = 'Login';
const UpdateToken: string = 'Update Token';
const Welcome: string = 'Welcome';
const homeUrl = 'https://powerbi-lineage.github.io/PowerBEye';

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.less']
})
export class AppBarComponent {
  public welcomeSTR: string;
  public isNotFirstTime: boolean = false;

  constructor(private dialog: MatDialog,
    private authService: AuthService) {
    this.welcomeSTR = Login;

    this.authService.getToken().subscribe((token: string) => {
      const parsedToken = this.parseJwt(token);
      if (parsedToken !== null && parsedToken.name) {
        this.welcomeSTR = Welcome + ' ' + parsedToken.name;
      } else if (token.length > 0) {
        this.welcomeSTR = UpdateToken;
      } else {
        this.welcomeSTR = Login;
      }

      if (!parsedToken) {
        if (this.isNotFirstTime) {
          this.dialog.open(ErrorDialogComponent, { data: { title: 'Error', errorMessage: 'The token is invalid, please refresh your token and try again' } })
        }
        this.isNotFirstTime = true;
      }
    });
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
  }
}
