import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { Subscription }from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  menu: string;
  subs: Subscription;
  shipment: boolean;
  address_book: boolean;

  constructor(
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    const x = this.router.url;
    if (x === '/cit/dashboard') {
      this.menu = 'dashboard';
    }

    else if (x === '/cit/user-profile') {
      this.menu = 'user-profile';
    }

    else if (x === '/cit/shipment/create') {
      this.menu = 'shipment-create';
      this.shipment = true;
    }

    else if (x == '/cit/address-book/create') {
      this.menu = 'address-book-create';
      this.address_book = true;
    }

    else if (x === '/cit/address-book/list') {
      this.menu = 'address-book-list';
      this.address_book = true;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  goto(s, link) {
    this.menu = s;
    this.router.navigate([`/cit/${link}`]);
    return false;
  }
}
