import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { ListDashboardComponent } from './list-dashboard/list-dashboard.component';
import { DetailDashboardComponent } from './detail-dashboard/detail-dashboard.component';

@NgModule({
  declarations: [
    MainDashboardComponent,
    ListDashboardComponent,
    DetailDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    ModalModule .forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
