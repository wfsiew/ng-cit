import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { ListDashboardComponent } from './list-dashboard/list-dashboard.component';
import { DetailDashboardComponent } from './detail-dashboard/detail-dashboard.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: '', component: MainDashboardComponent, canActivate: [AuthGuardService] },
  { path: 'list/:id/:company_id', component: ListDashboardComponent, canActivate: [AuthGuardService] },
  { path: 'detail/:consignment_no', component: DetailDashboardComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
