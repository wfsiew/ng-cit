import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { HomeComponent } from '../components/home/home.component';
import { MainDashboardComponent } from '../components/dashboard/main-dashboard/main-dashboard.component';
import { ListDashboardComponent } from '../components/dashboard/list-dashboard/list-dashboard.component';
import { DetailDashboardComponent } from '../components/dashboard/detail-dashboard/detail-dashboard.component';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { CreateShipmentComponent } from '../components/shipment/create-shipment/create-shipment.component';
import { CreateMultipleShipmentComponent } from '../components/shipment/create-multiple-shipment/create-multiple-shipment.component';
import { ListShipmentComponent } from '../components/shipment/list-shipment/list-shipment.component';
import { ListManifestComponent } from '../components/manifest/list-manifest/list-manifest.component';
import { DetailManifestComponent } from '../components/manifest/detail-manifest/detail-manifest.component';
import { CreateAddressBookComponent } from '../components/address-book/create-address-book/create-address-book.component';
import { ListAddressBookComponent } from '../components/address-book/list-address-book/list-address-book.component';
import { CreateCompanyComponent } from '../components/company/create-company/create-company.component';
import { ListCompanyComponent } from '../components/company/list-company/list-company.component';
import { ListUserComponent } from '../components/user/list-user/list-user.component';
import { CreateCompanyProfileComponent } from '../components/company-profile/create-company-profile/create-company-profile.component';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register/:serial_id', component: RegisterComponent },
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
      { path: 'company',
        children: [
          { path: 'create', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
          { path: 'list', component: ListCompanyComponent, canActivate: [AuthGuardService] },
          { path: 'edit/:id', component: CreateCompanyComponent, canActivate: [AuthGuardService] },
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
          { path: 'list', component: ListShipmentComponent, canActivate: [AuthGuardService] }
        ]
      },
      { path: 'address-book',
        children: [
          { path: 'create', component: CreateAddressBookComponent, canActivate: [AuthGuardService] },
          { path: 'list', component: ListAddressBookComponent, canActivate: [AuthGuardService] },
          { path: 'edit/:id', component: CreateAddressBookComponent, canActivate: [AuthGuardService] }
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
    RouterModule.forRoot(routes, { useHash: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
