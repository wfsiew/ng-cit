import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressBookService } from '../../../services/address-book.service';
import { MessageService } from '../../../services/message.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';

@Component({
  selector: 'app-list-address-book',
  templateUrl: './list-address-book.component.html',
  styleUrls: ['./list-address-book.component.css']
})
export class ListAddressBookComponent implements OnInit {

  list = [];
  itemsCount: number;
  selectAll = false;
  listSelected = [];

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private router: Router,
    private addressBookService: AddressBookService,
    private msService: MessageService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
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

  onChangeSelectAll() {
    this.selectAll = !this.selectAll;
    this.listSelected = [];
    _.each(this.list, (o) => {
      o.selected = this.selectAll;
      if (!o.selected) {
        this.listSelected = this.listSelected.filter(x => x !== o.id);
      }

      else {
        this.listSelected.push(o.id);
      }
    });
  }

  onChangeSelect(o) {
    o.selected = !o.selected;
    if (!o.selected) {
      this.listSelected = this.listSelected.filter(x => x !== o.id);
    }
    
    else {
      this.listSelected.push(o.id);
    }
  }

  onDeleteSelected() {
    this.addressBookService.deleteAddressBook(this.listSelected).subscribe(res => {
      this.selectAll = false;
      this.listSelected = [];
      this.load();
    },
    (error) => {
      this.toastr.error('Delete Address Book Failed', 'Delete Address Book');
    });
  }

  onEdit(o) {
    this.msService.send('edit-address-book', o);
    this.router.navigate(['/cit/address-book/create'], { queryParams: { edit: 1 }});
  }
}
