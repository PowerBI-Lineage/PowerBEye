import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LineageContainerComponent } from './components/lineage-container/lineage-container.component';

const routes: Routes = [
  {
    path: '',
    component: LineageContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineageRoutingModule { }
