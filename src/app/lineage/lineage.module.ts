import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineageContainerComponent } from './components/lineage-container/lineage-container.component';
import { LineageRoutingModule } from './lineage-routing.module';

@NgModule({
  declarations: [LineageContainerComponent],
  entryComponents: [LineageContainerComponent],
  imports: [
    CommonModule,
    LineageRoutingModule
  ]
})
export class LineageModule { }
