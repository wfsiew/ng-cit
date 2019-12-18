import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { LookupService } from 'src/app/services/lookup.service';
import { ShipmentService } from 'src/app/services/shipment.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/utils/helper';
import { AddressBookModalComponent } from 'src/app/shared/components/address-book-modal/address-book-modal.component';
import { PrintShipmentModalComponent } from '../print-shipment-modal/print-shipment-modal.component';

@Component({
  selector: 'app-create-multiple-shipment',
  templateUrl: './create-multiple-shipment.component.html',
  styleUrls: ['./create-multiple-shipment.component.css']
})
export class CreateMultipleShipmentComponent implements OnInit {

  isloading = false;
  serviceList = [];
  countryList = [];
  consignment_noList = [];
  mform: FormGroup;
  data: any;
  bsModalRef: BsModalRef;
  selectedAddressShipper: any;
  uploadResponse: any = { status: '', message: '', filePath: '' };
  isView = false;
  pdfstate = null;

  readonly isEmpty = Helper.isEmpty;
  readonly getDateStr = Helper.getDateStr;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private shipmentService: ShipmentService,
    private companyService: CompanyService,
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private loc: Location
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.load();
  }

  createForm() {
    this.mform = this.fb.group({
      company_account_code: new FormControl({ value: '', disabled: true }, [Validators.required]),
      company_name: new FormControl({ value: '', disabled: true }),
      service_type: ['', [Validators.required]],
      currency: ['MYR', [Validators.required]],
      pickup_date: [null],
      shipper_address_id: ['', [Validators.required]],
      origin_shipper_name: ['', [Validators.required]],
      file: [null]
    });
  }

  setForm() {
    const o = this.data;
    this.mform.patchValue({
      company_account_code: o.company_account_code,
      company_name: o.company_name,
      shipper_address_id: o.address,
      origin_shipper_name: o.company_pic_full_name
    });
  }

  load() {
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      this.loadUserDetails();
    });
    // this.lookupService.listService().subscribe((res: any) => {
    //   this.serviceList = res.data;
    // });
  }

  loadUserDetails() {
    this.authService.getUserDetails().subscribe((res: any) => {
      let user = !_.isEmpty(res.data) ? res.data[0] : {};
      let company_id = user.company_id;
      this.loadCompanyProfile(company_id);
    },
    (error) => {
      this.toastr.error('Load User Details Failed', 'Create Multiple Shipment');
    });
  }

  loadCompanyProfile(id) {
    this.companyService.getCompany(id).subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
      this.serviceList = this.data.company_service_list;
      this.setForm();
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed');
    });
  }

  onGetAddressShipper() {
    const state = {
      title: 'Address Book'
    };
    this.bsModalRef = this.modalService.show(AddressBookModalComponent, { initialState: state });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(res => {
      if (res.result === true) {
        this.selectedAddressShipper = res.data;
        this.setAddressShipper(res.data);
      }

      else {
        this.selectedAddressShipper = {};
      }
    });
    return false;
  }

  setAddressShipper(o) {
    this.mform.patchValue({
      shipper_address_id: o.id,
      origin_shipper_name: o.full_name
    });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.mform.patchValue({
        file: file
      });
    }
  }

  onSubmit() {
    if (_.isNull(this.f.file.value) || _.isUndefined(this.f.file.value)) {
      this.toastr.error('Import File is required');
      return;
    }
    const f = this.f;
    const formData = new FormData();
    formData.append('file', this.mform.get('file').value);
    formData.append('company_account_code', f.company_account_code.value);
    formData.append('delivery_service', f.service_type.value);
    formData.append('currency', f.currency.value);
    formData.append('is_do', 'True');
    formData.append('shipper_address_id', f.shipper_address_id.value);

    if (_.isNull(f.pickup_date.value) || _.isUndefined(f.pickup_date.value)) {
      formData.append('pickup_date', '');
    }

    else {
      formData.append('pickup_date', Helper.getDateStr(f.pickup_date.value));
    }

    this.isloading = true;
    this.shipmentService.uploadShipment(formData).subscribe((res: any) => {
      this.uploadResponse = res;
      if (res.gotError === true) {
        this.isloading = false;
        this.toastr.error('Error Detected in Import File, please amend and re-upload', 'Upload Shipment');
      }

      else if (res.gotError === false) {
        this.isloading = false;
        this.isView = true;
        this.consignment_noList = res.data.consignment_no_list;
        this.toastr.success('Upload Shipment successful', 'Upload Shipment');
        //this.onBack();
      }
    },
    (error) => {
      this.isloading = false;
      console.log(error)
      this.toastr.error('Upload Shipment Failed', 'Upload Shipment');
    })
  }

  onBack() {
    this.loc.back();
  }

  onPrintShipment() {
    if (!this.pdfstate) {
      this.isloading = true;
      this.shipmentService.printLabels(this.consignment_noList, AppConstant.PRINT_TYPE.NEWCONSIGNMENTNOTE).subscribe((res: any) => {
        this.isloading = false;
        const state = {
          pdfsrc: URL.createObjectURL(res),
          pdfblob: res,
          filename: `shipment-labels.pdf`
        };
        this.pdfstate = state;
        this.bsModalRef = this.modalService.show(PrintShipmentModalComponent, { initialState: state });
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Print Shipment Faled');
      });
    }

    else {
      this.bsModalRef = this.modalService.show(PrintShipmentModalComponent, { initialState: this.pdfstate });
    }
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }

  get service_type() {
    let p = this.f.service_type.value;
    let s = p;
    if (Helper.isEmpty(p)) {
      return p;
    }

    let o = _.find(this.serviceList, { service_code: p });
    if (!_.isUndefined(o)) {
      s = o.service_description;
    }

    return s;
  }

  get currency() {
    let p = this.f.currency.value;
    let s = p;
    if (Helper.isEmpty(p)) {
      return p;
    }

    let o = _.find(this.countryList, { currency: p });
    if (!_.isUndefined(o)) {
      s = o.currency;
    }

    return s;
  }
}
