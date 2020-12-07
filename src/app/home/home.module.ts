import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './components/home-container/home-container.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeProxy } from './services/home-proxy.service';

@NgModule({
  declarations: [HomeContainerComponent],
  entryComponents: [HomeContainerComponent],
  providers: [HomeProxy],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
