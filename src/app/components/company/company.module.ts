import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';

import { CompanyRoutingModule } from './company-routing.module';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { ListUserComponent } from 'src/app/components/user/list-user/list-user.component';

@NgModule({
  declarations: [
    CreateCompanyComponent,
    ListCompanyComponent,
    ListUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    ModalModule .forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    CompanyRoutingModule
  ]
})
export class CompanyModule { }
