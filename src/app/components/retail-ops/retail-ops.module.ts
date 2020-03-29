import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { StepsModule } from 'primeng/steps';

import { RetailOpsRoutingModule } from './retail-ops-routing.module';
import { RetailInboundRetailOpsComponent } from './retail-inbound-retail-ops/retail-inbound-retail-ops.component';
import { LoadsheetRetailOpsComponent } from './loadsheet-retail-ops/loadsheet-retail-ops.component';
import { ShipmentInfoRetailInboundComponent } from './shipment-info-retail-inbound/shipment-info-retail-inbound.component';

@NgModule({
  declarations: [
    RetailInboundRetailOpsComponent,
    LoadsheetRetailOpsComponent,
    ShipmentInfoRetailInboundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgSelectModule,
    StepsModule,
    PaginationModule.forRoot(),
    ModalModule .forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    RetailOpsRoutingModule
  ]
})
export class RetailOpsModule { }
