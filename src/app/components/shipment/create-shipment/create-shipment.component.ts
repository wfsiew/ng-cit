import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { LookupService } from '../../../services/lookup.service';
import { ShipmentService } from '../../../services/shipment.service';
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

  isloading = false;
  serviceList = [];
  countryList = [];
  uomList = [];
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
    private companyService: CompanyService,
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
      company_account_code: new FormControl({ value: '', disabled: true }),
      company_name: new FormControl({ value: '', disabled: true }),
      service_type: ['', [Validators.required]],
      uom: ['', [Validators.required]],
      pickup_date: [new Date(), [Validators.required]],
      customer_reference: ['', [Validators.required]],
      is_insurance_req: [false],
      is_do: [false],
      is_cod: [true],
      cod_value: ['10.00', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
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
    });
    this.lookupService.listUOM().subscribe((res: any) => {
      this.uomList = res.data;
    });
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
    this.gform.patchValue({
      description: '',
      quantity: '1',
      value: '0.00'
    });
  }

  onRemoveGoods() {
    let lx = this.listGood;
    this.listGood = lx.filter(x => !x.selected);
  }

  onChangeSelect(o) {
    o.selected = !o.selected;
  }

  onSubmit() {
    /*
{
	    "customer_reference": "MH01",
	    "origin_address_id": "ADC01",
	    "origin_shipper_address1": "No 136, Hala Lapangan Peradana, Hala Lapangan Panorama",
	    "origin_shipper_address2": "",
	    "origin_shipper_address3": "",
	    "origin_shipper_address4": "",
	    "origin_shipper_postcode": "31650",
	    "origin_shipper_city": "Puchong",
	    "origin_shipper_state_province": "Selangor",
	    "origin_shipper_district": "",
	    "origin_shipper_country": "MY",
      "origin_shipper_name": "Kong Mun Hoe",
	    "origin_shipper_phone_no": "0165324876",
	    "origin_shipper_mobile_no": "0165324876",
      "origin_shipper_email": "haseo2408@gmail.com",
      
	    "dest_address_id": "ADC02",
	    "dest_receiver_address1": "No 16, Jalan Bahagia, Taman ABC",
	    "dest_receiver_address2": "",
	    "dest_receiver_address3": "",
	    "dest_receiver_address4": "",
	    "dest_receiver_postcode": "47500",
	    "dest_receiver_city": "Petaling Jaya",
	    "dest_receiver_state_province": "Selangor",
	    "dest_receiver_district": "",
	    "dest_receiver_country": "MY",
	    "dest_receiver_phone_no": "0125529182",
	    "dest_receiver_mobile_no": "0125529182",
	    "dest_receiver_email": "haseo2409@gmail.com",
      "dest_receiver_name": "Kong Zai",
      
	    "cod": true,
	    "cod_value": 9.30,
	    "carton_box_code": "XL",
	    "total_package_no": 1,
	    "service_type": "EXP",
	    "order_amount" : 25.00,
	    "insurance_amount": 30.00,
	    "chargeable_weight": 5.00,
	    "chargeable_weight_uom": "KG",
	    "order_amount_currency": "MY",
	    "shipment_package_list":
	    [{
	    	"description" : "This is a good book to read",
	    	"weight": 4.2,
	    	"volume": 5.2,
	    	"height": 6.32,
	    	"length": 7.9,
	    	"width": 10.0,
	    	"value": 10.45,
	    	"currency": "MY",
	    	"quantity": 6,
	    	"uom":"PAS",
	    	"product_list": [{
	    		"product_name": "Magazine",
	    		"product_code": "Pieces",
	    		"value":"2",
	    		"currency":"MY",
	    		"quantity" : "2"
	    	}]
	    }]
}
    */
   let lp = _.map(this.listGood, (x) => {
     return {
       description: x.description,
       weight: 0.00,
       volume: 0.00,
       height: 0.00,
       length: 0.00,
       width: 0.00,
       value: x.value,
       currency: x.currency,
       quantity: x.quantity,
       uom: 'PAS',
       product_list: []
     }
   });
   let orderamt = 0;
   _.each(this.listGood, (x) => {
     orderamt += x.value * x.quantity
   });
   const f = this.f;
    const o = {
      company_id: this.data.company_id,
      customer_reference: f.customer_reference.value,
      pickup_date: Helper.getDateStr1(f.pickup_date.value),
      origin_address_id: '',
      origin_shipper_address1: f.origin_shipper_address1.value,
      origin_shipper_address2: f.origin_shipper_address2.value,
      origin_shipper_postcode: f.origin_shipper_postcode.value,
      origin_shipper_city: f.origin_shipper_city.value,
      origin_shipper_state_province: f.origin_shipper_state_province.value,
      origin_shipper_district: '',
      origin_shipper_country: f.origin_shipper_country.value,
      origin_shipper_name: f.origin_shipper_name.value,
      origin_shipper_phone_no: f.origin_shipper_phone_no.value,

      dest_address_id: '',
      dest_receiver_address1: f.dest_receiver_address1.value,
      dest_receiver_address2: f.dest_receiver_address2.value,
      dest_receiver_postcode: f.dest_receiver_postcode.value,
      dest_receiver_city: f.dest_receiver_city.value,
      dest_receiver_state_province: f.dest_receiver_state_province.value,
      dest_receiver_district: '',
      dest_receiver_country: f.dest_receiver_country.value,
      dest_receiver_phone_no: f.dest_receiver_phone_no.value,
      dest_receiver_name: f.dest_receiver_name.value,

      cod: f.is_cod.value,
      cod_value: f.cod_value.value,
      total_package_no: f.total_package_no.value,
      service_type: f.service_type.value,
      order_amount : orderamt,
      order_amount_currency: 'MYR',
      // chargeable_weight: f.total_weight.value,
      // chargeable_weight_uom: 'KG',
      shipment_package_list: lp
    };
    this.isloading = true;
    this.shipmentService.createShipment(o).subscribe(res => {
      this.isloading = false;
      this.toastr.success('New Shipment successfully created', 'Create Shipment');
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Create Shipment Failed', 'Create Shipment');
    })
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
