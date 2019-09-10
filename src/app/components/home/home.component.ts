import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  menu: string;
  address_book: boolean;
  data: any = {};

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

    else if (x.indexOf('/cit/company-profile') >= 0) {
      this.menu = 'company-profile';
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
  }

  ngOnDestroy() {
    
  }

  load() {
    this.authService.getUserDetails().subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
    });
  }

  logout() {
    this.authService.clear();
    this.router.navigate(['/login']);
    return false;
  }

  onAddressBookClick(event) {
    this.address_book = !this.address_book;
    return false;
  }

  goto(s, link) {
    this.menu = s;
    this.router.navigate([`/cit/${link}`]);
    return false;
  }
}
