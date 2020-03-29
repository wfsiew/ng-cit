import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ManifestRoutingModule } from './manifest-routing.module';
import { ListManifestComponent } from './list-manifest/list-manifest.component';
import { DetailManifestComponent } from './detail-manifest/detail-manifest.component';

@NgModule({
  declarations: [
    ListManifestComponent,
    DetailManifestComponent
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
    ManifestRoutingModule
  ]
})
export class ManifestModule { }
