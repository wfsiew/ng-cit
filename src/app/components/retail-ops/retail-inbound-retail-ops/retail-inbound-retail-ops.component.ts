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
  selector: 'app-retail-inbound-retail-ops',
  templateUrl: './retail-inbound-retail-ops.component.html',
  styleUrls: ['./retail-inbound-retail-ops.component.css']
})
export class RetailInboundRetailOpsComponent implements OnInit, OnDestroy {

  isloading = false;
  data: any = {
    charges: '',
    dropoff_point: '',
    tax: '',
    payment_type: '',
    total: ''
  };
  list = [];
  search = 'CIT1001013841';
  onSearchDbKeyup: any;
  subs: Subscription;

  constructor(
    private router: Router,
    private shipmentService: ShipmentService,
    private msService: MessageService,
    private toastr: ToastrService
  ) {
    this.onSearchDbKeyup = _.debounce(this.onSearchKeyup, 400);
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'retail-inbound-retail-ops') {
        const o = res.data;
        this.search = o.search;
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
    if (!this.search) return;
    this.isloading = true;
    this.shipmentService.getRetailInbound(this.search).subscribe((res: any) => {
      this.data = res.status ? res.data : {};
      this.list = res.status ? res.data.list : [];
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      if (error.status === 400) {
        this.data = {
          charges: '',
          dropoff_point: '',
          tax: '',
          payment_type: '',
          total: ''
        };
        this.list = [];
      }
      
      else {
        this.toastr.error('Load Retail Inbound Failed');
      }
    });
  }

  onSearch() {
    this.load();
  }

  onSearchKeyup(event) {
    this.onSearch();
  }

  onSearchKeypress(event) {
    this.onSearch();
  }

  onEditConsignment(o) {
    this.msService.send('', o);
  }

  onRemoveConsignment(o) {
    let ls = _.reject(this.list, (k) => {
      return k.consignment_no === o.consignment_no;
    });
    this.list = ls;
  }

  onEdit(o) {
    this.msService.send('retail-inbound-retail-ops', {
      search: this.search
    });
    localStorage.setItem('shipment-info-retail-inbound', this.search);
    this.router.navigate(['/cit/retail-ops/retail-inbound-shipment/edit', o.shipment_id]);
  }
}
