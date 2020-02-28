import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RetailInboundService } from 'src/app/services/retail-inbound.service';
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
    id: 0,
    charges: '',
    dropoff_point: '',
    tax: '',
    payment_type: '',
    total: ''
  };
  consignment_no = '';
  list = [];
  search = 'DRP00000000011';
  onSearchDbKeyup: any;
  subs: Subscription;

  constructor(
    private router: Router,
    private retailInboundService: RetailInboundService,
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
    this.retailInboundService.getRetailInbound(this.search).subscribe((res: any) => {
      this.data = res.status ? res.data : {};
      this.list = res.status ? res.data.list : [];
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      if (error.status === 400) {
        this.data = {
          id: 0,
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

  onConsignmentKeypress(event) {
    this.onAddConsignment();
  }

  onAddConsignment() {
    if (_.isNull(this.consignment_no) || this.consignment_no === '') {
      return;
    }
    
    let o = {
      id: this.data.id,
      consignment_no: this.consignment_no
    };
    this.retailInboundService.createRetailInboundShipment(o).subscribe((res: any) => {
      this.consignment_no = '';
      this.load();
    },
    (error) => {
      this.toastr.error('Create Retail Inbound Shipment Failed', 'Create Retail Inbound Shipment')
    });
  }

  onEditConsignment(o) {
    this.msService.send('', o);
  }

  onRemoveConsignment(o) {
    this.retailInboundService.removeRetailInboundShipment(o.id).subscribe((res: any) => {
      let ls = _.reject(this.list, (k) => {
        return k.id === o.id;
      },
      (error) => {
        this.toastr.error('Remove Retail Inbound Shipment Failed');
      });
      this.list = ls;
    });
  }

  onEdit(o) {
    this.msService.send('retail-inbound-retail-ops', {
      search: this.search
    });
    localStorage.setItem('shipment-info-retail-inbound', this.search);
    this.router.navigate(['/cit/retail-ops/retail-inbound-shipment/edit', o.id]);
  }
}
