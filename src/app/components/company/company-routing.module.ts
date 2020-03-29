import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { ListUserComponent } from 'src/app/components/user/list-user/list-user.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: 'create', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
  { path: 'list', component: ListCompanyComponent, canActivate: [AuthGuardService] },
  { path: 'edit/:id', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
  { path: 'detail/:id/:view', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
  { path: 'user',
    children: [
      { path: 'list', component: ListUserComponent, canActivate: [AuthGuardService] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
