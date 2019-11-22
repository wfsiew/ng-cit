import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressBookService } from 'src/app/services/address-book.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-list-address-book',
  templateUrl: './list-address-book.component.html',
  styleUrls: ['./list-address-book.component.css']
})
export class ListAddressBookComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  itemsCount = 0;
  is_private = false;
  tab = 0;
  selectAll = false;
  listSelected = [];
  page = 1;
  search = '';
  sort = 'full_name';
  sort_dir = '';
  onSearchDbKeyup: any;
  subs: Subscription;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;
  readonly MAX_PAGE_NUMBERS = AppConstant.MAX_PAGE_NUMBERS;

  constructor(
    private router: Router,
    private addressBookService: AddressBookService,
    private msService: MessageService,
    private toastr: ToastrService
  ) {
    this.onSearchDbKeyup = _.debounce(this.onSearchKeyup, 400);
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'list-address-book') {
        const o = res.data;
        this.page = o.page;
        this.sort = o.sort;
        this.sort_dir = o.dir;
        this.search = o.search;
        this.tab = o.tab;
        this.is_private = this.tab === 0 ? false : true;
      }
    });
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  load() {
    this.isloading = true;
    this.addressBookService.listAddressBook(this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search, this.is_private ? '1' : '0').subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      this.itemsCount = res.status ? res.recordsTotal : 0;
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
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
    this.msService.send('list-address-book', {
      page: this.page,
      sort: this.sort,
      dir: this.sort_dir,
      search: this.search,
      tab: this.tab
    });
    this.router.navigate(['/cit/address-book/edit', o.id], { queryParams: { private: this.is_private ? '1' : '0' } });
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.load();
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

  onTab(i) {
    this.tab = i;
    this.is_private = i === 0 ? false : true;
    this.load();
    return false;
  }

  onSearch() {
    this.load();
  }

  onSearchKeyup(event) {
    this.onSearch();
  }

  onSearchKeypress(event) {
    this.load();
  }
}
