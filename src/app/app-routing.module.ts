import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeContainerComponent } from './home/components/home-container/home-container.component';
import { LineageContainerComponent } from './lineage/components/lineage-container/lineage-container.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeContainerComponent
      },
      {
        path: 'lineage',
        component: LineageContainerComponent
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
