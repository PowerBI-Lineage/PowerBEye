import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './components/home-container/home-container.component';

@NgModule({
  declarations: [HomeContainerComponent],
  entryComponents: [HomeContainerComponent],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
