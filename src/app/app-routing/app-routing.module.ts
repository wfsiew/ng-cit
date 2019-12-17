import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { RegisterComponent } from 'src/app/components/register/register.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { MainDashboardComponent } from 'src/app/components/dashboard/main-dashboard/main-dashboard.component';
import { ListDashboardComponent } from 'src/app/components/dashboard/list-dashboard/list-dashboard.component';
import { DetailDashboardComponent } from 'src/app/components/dashboard/detail-dashboard/detail-dashboard.component';
import { UserProfileComponent } from 'src/app/components/user-profile/user-profile.component';
import { ChangePwdComponent } from 'src/app/components/user-profile/change-pwd/change-pwd.component';
import { CreateShipmentComponent } from 'src/app/components/shipment/create-shipment/create-shipment.component';
import { CreateMultipleShipmentComponent } from 'src/app/components/shipment/create-multiple-shipment/create-multiple-shipment.component';
import { ListShipmentComponent } from 'src/app/components/shipment/list-shipment/list-shipment.component';
import { ListManifestComponent } from 'src/app/components/manifest/list-manifest/list-manifest.component';
import { DetailManifestComponent } from 'src/app/components/manifest/detail-manifest/detail-manifest.component';
import { CreateAddressBookComponent } from 'src/app/components/address-book/create-address-book/create-address-book.component';
import { ListAddressBookComponent } from 'src/app/components/address-book/list-address-book/list-address-book.component';
import { CreateCompanyComponent } from 'src/app/components/company/create-company/create-company.component';
import { ListCompanyComponent } from 'src/app/components/company/list-company/list-company.component';
import { ListUserComponent } from 'src/app/components/user/list-user/list-user.component';
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
      { path: 'dashboard',
        children: [
          { path: '', component: MainDashboardComponent, canActivate: [AuthGuardService] },
          { path: 'list/:id/:company_id', component: ListDashboardComponent, canActivate: [AuthGuardService] },
          { path: 'detail/:consignment_no', component: DetailDashboardComponent, canActivate: [AuthGuardService] }
        ]
      },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService] },
      { path: 'change-pwd', component: ChangePwdComponent, canActivate: [AuthGuardService] },
      { path: 'company',
        children: [
          { path: 'create', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
          { path: 'list', component: ListCompanyComponent, canActivate: [AuthGuardService] },
          { path: 'edit/:id', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
          { path: 'detail/:id/:view', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
          { path: 'user',
            children: [
              { path: 'list', component: ListUserComponent, canActivate: [AuthGuardService] }
            ]
          }
        ]
      },
      { path: 'company-profile',
        children: [
          { path: 'create', component: CreateCompanyProfileComponent, canActivate: [AuthGuardService] }
        ]
      },
      { path: 'manifest',
        children: [
          { path: 'list', component: ListManifestComponent, canActivate: [AuthGuardService] },
          { path: 'detail/:manifest_no/:company_id', component: DetailManifestComponent, canActivate: [AuthGuardService] }
        ]
      },
      { path: 'shipment',
        children: [
          { path: 'create', component: CreateShipmentComponent, canActivate: [AuthGuardService] },
          { path: 'create/multiple', component: CreateMultipleShipmentComponent, canActivate: [AuthGuardService] },
          { path: 'list', component: ListShipmentComponent, canActivate: [AuthGuardService] },
          { path: 'detail/:id', component: CreateShipmentComponent, canActivate: [AuthGuardService] }
        ]
      },
      { path: 'address-book',
        children: [
          { path: 'create', component: CreateAddressBookComponent, canActivate: [AuthGuardService] },
          { path: 'list', component: ListAddressBookComponent, canActivate: [AuthGuardService] },
          { path: 'edit/:id', component: CreateAddressBookComponent, canActivate: [AuthGuardService] },
          { path: 'detail/:id/:view', component: CreateAddressBookComponent, canActivate: [AuthGuardService] }
        ]
      }
    ]
  },
  { path: '**', redirectTo: '/cit' }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
