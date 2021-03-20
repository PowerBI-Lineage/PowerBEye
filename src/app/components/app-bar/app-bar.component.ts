import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.less']
})
export class AppBarComponent {

  constructor(public dialog: MatDialog) {}

  public handleHomeNavigation(): void {
    location.reload();
  }

  public openDialog() {
    this.dialog.open(LoginDialogComponent);
  }
}
