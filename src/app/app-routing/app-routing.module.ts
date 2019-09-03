import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { CompanyProfileComponent } from '../components/company-profile/company-profile.component';
import { CreateShipmentComponent } from '../components/shipment/create-shipment/create-shipment.component';
import { ListShipmentComponent } from '../components/shipment/list-shipment/list-shipment.component';
import { CreateAddressBookComponent } from '../components/address-book/create-address-book/create-address-book.component';
import { ListAddressBookComponent } from '../components/address-book/list-address-book/list-address-book.component';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'cit', component: HomeComponent, canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService] },
      { path: 'company-profile', component: CompanyProfileComponent, canActivate: [AuthGuardService] },
      { path: 'shipment',
        children: [
          { path: 'create', component: CreateShipmentComponent, canActivate: [AuthGuardService] }
        ]
      },
      { path: 'address-book',
        children: [
          { path: 'create', component: CreateAddressBookComponent, canActivate: [AuthGuardService] },
          { path: 'list', component: ListAddressBookComponent, canActivate: [AuthGuardService] },
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
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
