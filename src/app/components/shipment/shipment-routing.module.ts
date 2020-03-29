import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateShipmentComponent } from './create-shipment/create-shipment.component';
import { CreateMultipleShipmentComponent } from './create-multiple-shipment/create-multiple-shipment.component';
import { ListShipmentComponent } from './list-shipment/list-shipment.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: 'create', component: CreateShipmentComponent, canActivate: [AuthGuardService] },
  { path: 'create/multiple', component: CreateMultipleShipmentComponent, canActivate: [AuthGuardService] },
  { path: 'list', component: ListShipmentComponent, canActivate: [AuthGuardService] },
  { path: 'detail/:id', component: CreateShipmentComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }
