import { Component, OnInit } from '@angular/core';
import { HomeProxy } from '../../services/home-proxy.service';

@Component({
  selector: 'home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.less']
})
export class HomeContainerComponent implements OnInit {

  constructor(private proxy: HomeProxy) { }

  ngOnInit(): void {
  }

  public sendModifyWorkspaces(): void {
    // tslint:disable-next-line: deprecation
    // tslint:disable-next-line: no-shadowed-variable
    const result = this.proxy.getModifedWorkspaces().subscribe(result => {
      console.log(result);
    });

  }

}
