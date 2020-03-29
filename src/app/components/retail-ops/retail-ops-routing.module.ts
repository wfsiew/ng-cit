import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RetailInboundRetailOpsComponent } from './retail-inbound-retail-ops/retail-inbound-retail-ops.component'
import { LoadsheetRetailOpsComponent } from './loadsheet-retail-ops/loadsheet-retail-ops.component';
import { ShipmentInfoRetailInboundComponent } from './shipment-info-retail-inbound/shipment-info-retail-inbound.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

const routes: Routes = [
  { path: 'retail-inbound', component: RetailInboundRetailOpsComponent, canActivate: [AuthGuardService] },
  { path: 'loadsheet', component: LoadsheetRetailOpsComponent, canActivate: [AuthGuardService] },
  { path: 'retail-inbound-shipment/create', component: ShipmentInfoRetailInboundComponent, canActivate: [AuthGuardService] },
  { path: 'retail-inbound-shipment/edit/:id', component: ShipmentInfoRetailInboundComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailOpsRoutingModule { }
