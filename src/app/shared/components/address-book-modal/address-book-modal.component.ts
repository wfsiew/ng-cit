import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AddressBookService } from 'src/app/services/address-book.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-address-book-modal',
  templateUrl: './address-book-modal.component.html',
  styleUrls: ['./address-book-modal.component.css']
})
export class AddressBookModalComponent implements OnInit {

  title: string;
  closeBtnName: string;
  list = [];
  itemsCount = 0;
  page = 1;
  search = '';
  sort = 'full_name';
  sort_dir = '';

  public onClose: Subject<any>;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;

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
    this.addressBookService.listAddressBook(this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search).subscribe((res: any) => {
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

  pageChanged(event: any) {
    this.page = event.page;
  }

  sortBy(s) {
    if (s !== this.sort) {
      this.sort_dir = '';
      this.sort = s;
    }

    else {
      this.sort_dir = this.sort_dir === '' ? 'desc' : '';
    }
    this.load();

    return false;
  }

  isSortBy(s, dir) {
    return this.sort === s && this.sort_dir === dir;
  }

  onSearch() {
    this.load();
  }

  onSearchKeypress(event) {
    this.load();
  }
}
