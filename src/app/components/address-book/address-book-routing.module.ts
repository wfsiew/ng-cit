import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAddressBookComponent } from './create-address-book/create-address-book.component';
import { ListAddressBookComponent } from './list-address-book/list-address-book.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: 'create', component: CreateAddressBookComponent, canActivate: [AuthGuardService] },
  { path: 'list', component: ListAddressBookComponent, canActivate: [AuthGuardService] },
  { path: 'edit/:id', component: CreateAddressBookComponent, canActivate: [AuthGuardService] },
  { path: 'detail/:id/:view', component: CreateAddressBookComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressBookRoutingModule { }
