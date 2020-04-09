import { Component, OnInit } from '@angular/core';
import { ManifestService } from 'src/app/services/manifest.service';
import { AuthService } from 'src/app/services/auth.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PrintShipmentModalComponent } from '../../shipment/print-shipment-modal/print-shipment-modal.component';
import { Runsheet } from './models/runsheet';

@Component({
  selector: 'app-loadsheet-retail-ops',
  templateUrl: './loadsheet-retail-ops.component.html',
  styleUrls: ['./loadsheet-retail-ops.component.css']
})
export class LoadsheetRetailOpsComponent implements OnInit {

  isloading = false;
  list = [];
  data: any = {};
  bsModalRef: BsModalRef;
  search = ''; //'LDFX17000134';
  username: string;
  company_id: string;
  onSearchDbKeyup: any;
  pdfstate = null;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private manifestService: ManifestService,
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.onSearchDbKeyup = _.debounce(this.onSearchKeyup, 400);
  }

  ngOnInit() {
  }

  load() {
    if (!this.search) return;
    this.loadUserDetails();
    this.isloading = true;
    this.manifestService.getManifestLoad(this.search).subscribe((res: any) => {
      this.list = res.data;
      this.data = Helper.isEmpty(this.list) ? {} : this.list[0];
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load Loadsheet Failed');
    });
  }

  loadUserDetails() {
    this.authService.getUserDetails().subscribe((res: any) => {
      let user = !_.isEmpty(res.data) ? res.data[0] : {};
      this.username = user.username;
      this.company_id = user.company_id;
    },
    (error) => {
      this.toastr.error('Load User Details Failed', 'Loadsheet');
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

  onPrintRunsheet() {
    const r = new Runsheet(this.search, this.data, this.list, this.username);
    r.getPdf();
  }

  onPrintManifest() {
    const dt = Helper.getDateStr(new Date());
    const a = dt.split('-');
    const y = a[0].substring(2);
    //const dx = `${a[2]}/${a[1]}/${y}`;

    if (!this.pdfstate) {
      this.isloading = true;
      this.manifestService.printLabel(this.company_id, dt).subscribe((res: any) => {
        this.isloading = false;
        const state = {
          pdfsrc: URL.createObjectURL(res),
          pdfblob: res,
          filename: `manifest-${dt}.pdf`
        };
        this.pdfstate = state;
        this.bsModalRef = this.modalService.show(PrintShipmentModalComponent, { initialState: state });
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Print Manifest Faled');
      })
    }

    else {
      this.bsModalRef = this.modalService.show(PrintShipmentModalComponent, { initialState: this.pdfstate });
    }
  }
}
