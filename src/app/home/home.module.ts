import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './components/home-container/home-container.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeProxy } from './services/home-proxy.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [HomeContainerComponent],
  entryComponents: [HomeContainerComponent],
  providers: [HomeProxy],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class HomeModule { }
