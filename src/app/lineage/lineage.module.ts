import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineageContainerComponent } from './components/lineage-container/lineage-container.component';

@NgModule({
  declarations: [LineageContainerComponent],
  entryComponents: [LineageContainerComponent],
  imports: [
    CommonModule
  ]
})
export class LineageModule { }
