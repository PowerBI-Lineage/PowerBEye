import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'powerBEye';

  constructor(private router: Router) {
  }

  public handleHomeNavigation(): void {
    location.reload();
  }
}
