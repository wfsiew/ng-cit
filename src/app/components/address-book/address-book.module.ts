import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule, ModalModule, BsDatepickerModule } from 'ngx-bootstrap';

import { AddressBookRoutingModule } from './address-book-routing.module';
import { CreateAddressBookComponent } from './create-address-book/create-address-book.component';
import { ListAddressBookComponent } from './list-address-book/list-address-book.component';

@NgModule({
  declarations: [
    CreateAddressBookComponent,
    ListAddressBookComponent
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
    AddressBookRoutingModule
  ]
})
export class AddressBookModule { }
