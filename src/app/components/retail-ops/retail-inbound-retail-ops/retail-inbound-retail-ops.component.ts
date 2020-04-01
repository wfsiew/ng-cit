import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RetailInboundService } from 'src/app/services/retail-inbound.service';
import { ShipmentService } from 'src/app/services/shipment.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/utils/helper';
import { SocketioService } from 'src/app/services/socketio.service';
import { PrintShipmentModalComponent } from '../../shipment/print-shipment-modal/print-shipment-modal.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-retail-inbound-retail-ops',
  templateUrl: './retail-inbound-retail-ops.component.html',
  styles: [`
    :host /deep/ .ui-steps .ui-steps-item {
      width: 33%;
    }
  `],
  styleUrls: ['./retail-inbound-retail-ops.component.css']
})
export class RetailInboundRetailOpsComponent implements OnInit, OnDestroy {

  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  isloading = false;
  tid: any;
  data: any = {
    id: 0,
    charges: '',
    dropoff_point: '',
    tax: '',
    payment_type: '',
    is_complete: false,
    total: ''
  };
  consignment_no = '';
  list = [];
  search = ''; //'DRP00000000011';
  pdfstate = null;
  current_progress = 0;
  subs: Subscription;
  modalRef: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };

  items: MenuItem[] = [
    { label: 'Shipment Details' },
    { label: 'Confirm Payment' },
    { label: 'Complete' }
  ];

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private router: Router,
    private retailInboundService: RetailInboundService,
    private shipmentService: ShipmentService,
    private msService: MessageService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private socketService: SocketioService
  ) {
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'retail-inbound-retail-ops') {
        const o = res.data;
        this.search = o.search;
      }
    });
  }

  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.socketService.on('cit-confirm-payment-success').subscribe((data: any) => {
      if (data.barcode === this.search) {
        this.retailInboundService.confirmPayment({ num: this.search }).subscribe((res: any) => {
          clearTimeout(this.tid);
          this.isloading = false;
          this.data.is_complete = true;
          this.setProgress();
          this.toastr.success('Payment Successful');
        },
        (error) => {
          this.isloading = false;
          this.toastr.error('Confirm Payment Failed', 'Retail Inbound Confirm Payment');
        });
      }
    });
    this.socketService.on('cit-confirm-payment-fail').subscribe((data: any) => {
      if (data.barcode === this.search) {
        this.isloading = false;
        this.toastr.error('Confirm Payment Failed', 'Retail Inbound Confirm Paymen');
      }
    });
    this.load();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  load() {
    this.setProgress();
    if (!this.search) return;
    this.isloading = true;
    this.retailInboundService.getRetailInbound(this.search).subscribe((res: any) => {
      this.data = res.status ? res.data : {};
      this.list = res.status ? res.data.list : [];
      this.setProgress();
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
          is_complete: false,
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
    this.pdfstate = null;
    this.load();
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
      this.toastr.error('Create Retail Inbound Shipment Failed', 'Create Retail Inbound Shipment');
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

  onPrintShipment() {
    if (Helper.isEmpty(this.list)) {
      return;
    }

    if (!this.pdfstate) {
      this.isloading = true;

      let ls = _.map(this.list, (x) => {
        return x.consignment_no;
      });

      this.shipmentService.printLabels(ls, AppConstant.PRINT_TYPE.NEWCONSIGNMENTNOTE).subscribe((res: any) => {
        this.isloading = false;
        const state = {
          pdfsrc: URL.createObjectURL(res),
          pdfblob: res,
          filename: `${this.search}.pdf`
        };
        this.pdfstate = state;
        this.modalRef = this.modalService.show(PrintShipmentModalComponent, { initialState: state });
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Print Shipment Failed');
      });
    }

    else {
      this.modalRef = this.modalService.show(PrintShipmentModalComponent, { initialState: this.pdfstate });
    }
  }

  onConfirmPayment() {
    if (this.data.payment_type === 'CASH') {
      this.isloading = true;
      this.retailInboundService.cashPayment({ num: this.search }).subscribe((res: any) => {
        clearTimeout(this.tid);
        this.isloading = false;
        this.data.is_complete = true;
        this.setProgress();
        this.toastr.success('Payment Successful');
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Confirm Payment Failed', 'Retail Inbound Confirm Payment');
      });
    }

    else {
      this.isloading = true;
      this.socketService.send('cit-confirm-payment', {
        barcode: this.search
      });
      this.tid = setTimeout(() => {
        this.isloading = false;
        if (this.data.is_complete === true) {
          return;
        }
        
        this.openConfirmPaymentRetryModal(this.template);
      }, 30000);
    }
  }

  onConfirmPaymentRetry() {
    this.modalRef.hide();
    this.onConfirmPayment();
  }

  openConfirmPaymentRetryModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  setProgress() {
    this.current_progress = 0;

    if (Helper.isEmpty(this.search)) {
      return;
    }

    if (this.isDisableConfirmPayment === false) {
      this.current_progress = 1;
    }

    if (this.data.is_complete === true) {
      this.current_progress = 2;
    }
  }

  get isDisableConfirmPayment() {
    if (this.data.is_complete === true || Helper.isEmpty(this.search) || Helper.isEmpty(this.list)) {
      return true;
    }

    let b = _.some(this.list, (k) => {
      return !k.is_complete;
    });
    return b;
  }

  get payment_status() {
    if (this.data.is_complete === true) {
      return 'PAID';
    }

    return 'UNPAID';
  }
}
