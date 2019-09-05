import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LookupService } from '../../../services/lookup.service';
import { ShipmentService } from '../../../services/shipment.service';
import { MessageService } from '../../../services/message.service';
import { CompanyService } from '../../../services/company.service';
import { AppConstant } from '../../../shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from '../../../shared/utils/helper';
import { AddressBookModalComponent } from '../../../shared/components/address-book-modal/address-book-modal.component';

@Component({
  selector: 'app-create-shipment',
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css']
})
export class CreateShipmentComponent implements OnInit {

  serviceList = [];
  countryList = [];
  mform: FormGroup;
  gform: FormGroup;
  data: any;
  listGood = [];
  bsModalRef: BsModalRef;
  selectedAddressShipper: any;
  selectedAddressReceiver: any;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private shipmentService: ShipmentService,
    private msService: MessageService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private loc: Location
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.load();
  }

  createForm() {
    this.mform = this.fb.group({
      company_account_code: new FormControl({ value: '', disabled: true }),
      company_name: new FormControl({ value: '', disabled: true }),
      service_type: ['', [Validators.required]],
      pickup_date: ['', [Validators.required]],
      customer_reference: ['', [Validators.required]],
      is_insurance_req: [true],
      is_do: [false],
      is_cod: [false],
      cod_value: ['0.00', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      total_package_no: ['', [Validators.required, Validators.pattern(AppConstant.VALIDATE.NUMBER)]],
      total_weight: ['', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],

      origin_shipper_name: ['', [Validators.required]],
      origin_shipper_address1: ['', [Validators.required]],
      origin_shipper_address2: [''],
      origin_shipper_postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      origin_shipper_city: ['', [Validators.required]],
      origin_shipper_state_province: ['', [Validators.required]],
      origin_shipper_country: ['MY', [Validators.required]],
      origin_shipper_contact_name: ['', [Validators.required]],
      origin_shipper_phone_no: ['', [Validators.required]],

      dest_receiver_name: ['', [Validators.required]],
      dest_receiver_address1: ['', [Validators.required]],
      dest_receiver_address2: [''],
      dest_receiver_postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      dest_receiver_city: ['', [Validators.required]],
      dest_receiver_state_province: ['', [Validators.required]],
      dest_receiver_country: ['MY', [Validators.required]],
      dest_receiver_contact_name: ['', [Validators.required]],
      dest_receiver_phone_no: ['', [Validators.required]]
    });

    this.gform = this.fb.group({
      description: ['', [Validators.required]],
      quantity: ['1', [Validators.required, Validators.pattern(AppConstant.VALIDATE.NUMBER)]],
      value: ['0.00', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      currency: ['MYR', [Validators.required]]
    });
  }

  setForm() {
    const o = this.data;
    let s = o.company_country;
    let k = _.find(this.countryList, (x) => {
      return x.country_code === s;
    });
    if (_.isUndefined(k)) {
      s = 'MY';
    }
    this.mform.patchValue({
      company_account_code: o.company_account_code,
      company_name: o.company_name,

      origin_shipper_name: o.company_name,
      origin_shipper_address1: o.company_address1,
      origin_shipper_address2: o.company_address2,
      origin_shipper_postcode: o.company_postcode,
      origin_shipper_city: o.company_city,
      origin_shipper_state_province: o.company_state_province,
      origin_shipper_country: s,
      is_do: o.is_do,
      is_cod: o.is_cod
    });
  }

  load() {
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      this.loadCompanyProfile();
    });
    this.lookupService.listService().subscribe((res: any) => {
      this.serviceList = res.data;
    })
  }

  loadCompanyProfile() {
    this.companyService.getCompanyDetails().subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
      this.setForm();
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed', 'Company Detail');
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

  onGetAddressReceiver() {
    const state = {
      title: 'Address Book'
    };
    this.bsModalRef = this.modalService.show(AddressBookModalComponent, { initialState: state });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(res => {
      if (res.result === true) {
        this.selectedAddressReceiver = res.data;
        this.setAddressReceiver(res.data);
      }

      else {
        this.selectedAddressReceiver = {};
      }
    });
    return false;
  }

  setAddressShipper(o) {
    let s = o.country;
    let k = _.find(this.countryList, (x) => {
      return x.country_code === s;
    });
    if (_.isUndefined(k)) {
      s = 'MY';
    }
    this.mform.patchValue({
      origin_shipper_name: o.full_name,
      origin_shipper_address1: o.address1,
      origin_shipper_address2: o.address2,
      origin_shipper_postcode: o.postcode,
      origin_shipper_city: o.city,
      origin_shipper_state_province: o.state_province,
      origin_shipper_country: s
    });
  }

  setAddressReceiver(o) {
    let s = o.country;
    let k = _.find(this.countryList, (x) => {
      return x.country_code === s;
    });
    if (_.isUndefined(k)) {
      s = 'MY';
    }
    this.mform.patchValue({
      dest_receiver_name: o.full_name,
      dest_receiver_address1: o.address1,
      dest_receiver_address2: o.address2,
      dest_receiver_postcode: o.postcode,
      dest_receiver_city: o.city,
      dest_receiver_state_province: o.state_province,
      dest_receiver_country: s
    });
  }

  onCountryChangeShipper() {
    this.mform.get('origin_shipper_postcode').setValidators([
      Validators.required,
      Validators.pattern(Helper.getPostcodePattern(this.f.origin_shipper_country.value))
    ]);
    this.mform.updateValueAndValidity();
  }

  onCountryChangeReceiver() {
    this.mform.get('dest_receiver_postcode').setValidators([
      Validators.required,
      Validators.pattern(Helper.getPostcodePattern(this.f.dest_receiver_country.value))
    ]);
    this.mform.updateValueAndValidity();
  }

  onAddGoods() {
    const f = this.fg;
    const o = {
      description: f.description.value,
      quantity: Number(f.quantity.value),
      value: parseFloat(f.value.value),
      currency: f.currency.value
    };
    this.listGood.push(o);
  }

  onRemoveGoods() {
    let lx = this.listGood;
    this.listGood = lx.filter(x => !x.selected);
  }

  onChangeSelect(o) {
    o.selected = !o.selected;
  }

  onSubmit() {
    
  }

  onBack() {
    this.loc.back();
  }

  get f() {
    return this.mform.controls;
  }

  get fg() {
    return this.gform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }

  invalidg(s: string) {
    const m = this.gform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
