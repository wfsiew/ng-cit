import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { ChangePwdComponent } from 'src/app/components/user-profile/change-pwd/change-pwd.component';
import { CreateCompanyProfileComponent } from 'src/app/components/company-profile/create-company-profile/create-company-profile.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:id', component: ResetPasswordComponent },
  {
    path: 'cit', component: HomeComponent, canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import(`src/app/components/dashboard/dashboard.module`).then(m => m.DashboardModule) },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService] },
      { path: 'change-pwd', component: ChangePwdComponent, canActivate: [AuthGuardService] },
      { path: 'company', loadChildren: () => import(`src/app/components/company/company.module`).then(m => m.CompanyModule) },
      { path: 'company-profile',
        children: [
          { path: 'create', component: CreateCompanyProfileComponent, canActivate: [AuthGuardService] }
        ]
      },
      { path: 'manifest', loadChildren: () => import(`src/app/components/manifest/manifest.module`).then(m => m.ManifestModule) },
      { path: 'shipment', loadChildren: () => import(`src/app/components/shipment/shipment.module`).then(m => m.ShipmentModule) },
      { path: 'address-book', loadChildren: () => import(`src/app/components/address-book/address-book.module`).then(m => m.AddressBookModule) },
      { path: 'retail-ops', loadChildren: () => import(`src/app/components/retail-ops/retail-ops.module`).then(m => m.RetailOpsModule) }
    ]
  },
  { path: '**', redirectTo: '/cit/dashboard' }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
