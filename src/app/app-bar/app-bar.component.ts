import { Component } from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.less']
})
export class AppBarComponent {

  public handleHomeNavigation(): void {
    location.reload();
  }
}
