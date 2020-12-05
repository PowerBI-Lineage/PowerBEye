import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './components/home-container/home-container.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeContainerComponent],
  entryComponents: [HomeContainerComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
