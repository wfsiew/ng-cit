import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddressBookService } from '../../../services/address-book.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';

@Component({
  selector: 'app-address-book-modal',
  templateUrl: './address-book-modal.component.html',
  styleUrls: ['./address-book-modal.component.css']
})
export class AddressBookModalComponent implements OnInit {

  closeBtnName: string;
  list = [];
  itemsCount: number;
  page = 1;

  public onClose: Subject<any>;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    public bsModalRef: BsModalRef,
    private addressBookService: AddressBookService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.load();
  }

  load() {
    this.addressBookService.listAddressBook().subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      this.itemsCount = res.status ? res.recordsTotal : 0;
    },
    (error) => {
      if (error.status === 400) {
        this.list = [];
        this.itemsCount = 0;
      }

      else {
        this.toastr.error('Load Address Book Failed');
      }
    });
  }

  select(o) {
    this.onClose.next({ result: true, data: o });
    this.bsModalRef.hide();
    return false;
  }

  onHide() {
    this.onClose.next({ result: false, data: null });
    this.bsModalRef.hide();
  }
}
