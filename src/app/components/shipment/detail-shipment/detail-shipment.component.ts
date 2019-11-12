import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShipmentService } from 'src/app/services/shipment.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';
import * as FileSaver from 'file-saver'; 

@Component({
  selector: 'app-detail-shipment',
  templateUrl: './detail-shipment.component.html',
  styleUrls: ['./detail-shipment.component.css']
})
export class DetailShipmentComponent implements OnInit {

  isloading = false;
  serviceList = [];
  countryList = [];
  uomList = [];
  data: any = {};
  datax: any = {};
  id: string;
  listGood = [];
  shipmentPackage: any = {};

  readonly Helper = Helper;

  constructor(
    private shipmentService: ShipmentService,
    private companyService: CompanyService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private loc: Location
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.load();
    });
  }

  load() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.authService.getUserDetails().subscribe((res: any) => {
      let user = !_.isEmpty(res.data) ? res.data[0] : {};
      let company_id = user.company_id;
      this.loadCompanyProfile(company_id);
    },
    (error) => {
      this.toastr.error('Load User Details Failed', 'Create Shipment');
    });
  }

  loadCompanyProfile(id) {
    this.companyService.getCompany(id).subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
      this.loadShipment();
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed', 'Shipment Detail');
    });
  }

  loadShipment() {
    this.shipmentService.getShipment(this.id).subscribe((res: any) => {
      this.datax = !_.isEmpty(res.data) ? res.data[0] : {};
      if (!Helper.isEmpty(this.datax)) {
        this.shipmentPackage = this.datax.shipment_package_list[0];
        this.loadProductList();
      }
    },
    (error) => {
      this.toastr.error('Load Shipment Detail Failed', 'Shipment Detail');
    });
  }

  loadProductList() {
    const ls = this.shipmentPackage.product_list;
    if (Helper.isEmpty(ls)) {
      return;
    }

    _.each(ls, (x) => {
      this.listGood.push({
        description: `${x.product_name} (${x.product_code})`,
        quantity: x.quantity,
        value: x.value,
        currency: x.currency
      });
    });
  }

  onPrintShipment() {
    if (_.isEmpty(this.datax)) {
      return;
    }

    this.shipmentService.printLabel(this.datax.consignment_no, AppConstant.PRINT_TYPE.NEWCONSIGNMENTNOTE).subscribe((res: any) => {
      FileSaver.saveAs(res, `${this.datax.consignment_no}.pdf`);
    },
    (error) => {
      this.toastr.error('Print Shipment Faled');
    });
  }

  onBack() {
    this.loc.back();
  }

  get isPrintDisabled() {
    return Helper.isEmpty(this.datax);
  }
}
