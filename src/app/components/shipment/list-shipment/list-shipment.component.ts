import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShipmentService } from 'src/app/services/shipment.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-list-shipment',
  templateUrl: './list-shipment.component.html',
  styleUrls: ['./list-shipment.component.css']
})
export class ListShipmentComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  itemsCount = 0;
  page = 1;
  search = '';
  is_own = true;
  sort = 'create_date';
  sort_dir = 'desc';
  onSearchDbKeyup: any;
  sx = 0;
  sy = 0;
  subs: Subscription;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;
  readonly MAX_PAGE_NUMBERS = AppConstant.MAX_PAGE_NUMBERS;

  constructor(
    private router: Router,
    private shipmentService: ShipmentService,
    private msService: MessageService,
    private toastr: ToastrService
  ) {
    this.onSearchDbKeyup = _.debounce(this.onSearchKeyup, 400);
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'list-shipment') {
        const o = res.data;
        this.page = o.page;
        this.sort = o.sort;
        this.sort_dir = o.dir;
        this.search = o.search;
        this.is_own = o.is_own;
        this.sx = o.sx;
        this.sy = o.sy;
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
    this.shipmentService.listShipment(this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search, this.is_own).subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      this.itemsCount = res.status ? res.recordsTotal : 0;
      this.isloading = false;
      setTimeout(() => {
        window.scrollTo(this.sx, this.sy);
      }, 200);
    },
    (error) => {
      this.isloading = false;
      if (error.status === 400) {
        this.list = [];
        this.itemsCount = 0;
      }

      else {
        this.toastr.error('Load Shipment Failed');
      }
    });
  }

  onDetails(o) {
    this.msService.send('list-shipment', {
      page: this.page,
      sort: this.sort,
      dir: this.sort_dir,
      search: this.search,
      is_own: this.is_own,
      sx: window.scrollX,
      sy: window.scrollY
    });
    this.router.navigate(['/cit/shipment/detail', o.id]);
  }

  onChangeIsOwn(event) {
    this.is_own = !this.is_own;
    this.load();
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.load();
  }

  goto(s) {
    this.msService.send('list-shipment', {
      page: this.page,
      sort: this.sort,
      dir: this.sort_dir,
      search: this.search,
      is_own: this.is_own,
      sx: window.scrollX,
      sy: window.scrollY
    });
    this.router.navigate([s]);
    return false;
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

  onPrintLabel(o) {
    this.shipmentService.printLabel(o.consignment_no, AppConstant.PRINT_TYPE.SHIPPING_LABEL).subscribe(res => {

    },
    (error) => {
      console.log(error);
    });
  }

  isSortBy(s, dir) {
    return this.sort === s && this.sort_dir === dir;
  }

  onSearch() {
    this.page = 1;
    this.load();
  }

  onSearchKeyup(event) {
    this.onSearch();
  }

  onSearchKeypress(event) {
    this.onSearch();
  }
}
