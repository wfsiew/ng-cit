import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import _ from 'lodash';
import { User } from 'src/app/shared/models/user';
import { AppConstant } from 'src/app/shared/constants/app.constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu: string;
  address_book: boolean;
  retail_ops: boolean;
  data: any = {};
  user: User;

  readonly ROLE = AppConstant.ROLE;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.load();
    const x = this.router.url;
    if (x === '/cit/dashboard') {
      this.menu = 'dashboard';
    }

    else if (x === '/cit/user-profile') {
      this.menu = 'user-profile';
    }

    else if (x.indexOf('/cit/company') >= 0) {
      this.menu = 'company';
    }

    else if (x.indexOf('/cit/manifest') >= 0){
      this.menu = 'manifest';
    }

    else if (x.indexOf('/cit/shipment') >= 0){
      this.menu = 'shipment';
    }

    else if (x == '/cit/address-book/create') {
      this.menu = 'address-book-create';
      this.address_book = true;
    }

    else if (x === '/cit/address-book/list' || x.indexOf('/cit/address-book/edit') >= 0) {
      this.menu = 'address-book-list';
      this.address_book = true;
    }

    else if (x === '/cit/retail-ops/retail-inbound' || x.indexOf('/cit/retail-ops/retail-inbound-shipment') >= 0) {
      this.menu = 'retail-ops-retail-inbound';
      this.retail_ops = true;
    }

    else if (x === '/cit/retail-ops/loadsheet') {
      this.menu = 'retail-ops-loadsheet';
      this.retail_ops = true;
    }
  }

  load() {
    this.user = this.authService.loadUser();
    this.authService.getUserDetails().subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
    });
  }

  logout() {
    this.authService.logout().subscribe(res => {
      this.authService.clear();
      this.router.navigate(['/login']);
    });
    
    return false;
  }

  onAddressBookClick() {
    this.address_book = !this.address_book;
    return false;
  }

  onRetailOpsClick() {
    this.retail_ops = !this.retail_ops;
    return false;
  }

  goto(s, link) {
    this.menu = s;
    this.router.navigate([`/cit/${link}`]);
    return false;
  }
}
