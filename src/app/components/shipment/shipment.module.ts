import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ShipmentRoutingModule } from './shipment-routing.module';
import { CreateShipmentComponent } from './create-shipment/create-shipment.component';
import { CreateMultipleShipmentComponent } from './create-multiple-shipment/create-multiple-shipment.component';
import { ListShipmentComponent } from './list-shipment/list-shipment.component';

@NgModule({
  declarations: [
    CreateShipmentComponent,
    CreateMultipleShipmentComponent,
    ListShipmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    ShipmentRoutingModule
  ]
})
export class ShipmentModule { }
