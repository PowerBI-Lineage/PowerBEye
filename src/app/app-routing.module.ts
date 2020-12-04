import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeContainerComponent } from './home/components/home-container/home-container.component';
import { LineageContainerComponent } from './lineage/components/lineage-container/lineage-container.component';

const routes: Routes = [
  {
    path: 'home',
    pathMatch: 'full',
    component: HomeContainerComponent
  },
  {
    path: 'lineage',
    pathMatch: 'full',
    component: LineageContainerComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
