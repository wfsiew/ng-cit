import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  data: any = {};
  datax: any = {};
  id: string;
  listGood = [];
  shipmentPackage: any = {};
  bsModalRef: BsModalRef;
  selectedAddressShipper: any;
  selectedAddressReceiver: any;
  isEdit = false;
  isView = false;
  allowEdit = true;
  title = 'Create';
  pdfstate = null;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private shipmentService: ShipmentService,
    private companyService: CompanyService,
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      // this.isView = params.get('view') === '0' ? true : false;
      if (!_.isNull(this.id)) {
        this.isEdit = true;
        this.isView = true;
        this.title = 'Edit';
      }

      this.load();
    });
  }

  createForm() {
    this.mform = this.fb.group({
      company_account_code: new FormControl({ value: '', disabled: true }),
      company_name: new FormControl({ value: '', disabled: true }),
      consignment_no: new FormControl({ value: '', disabled: true }),
      service_type: ['', [Validators.required]],
      uom: ['', [Validators.required]],
      pickup_date: [null],
      customer_reference: ['', [Validators.required]],
      is_insurance_req: [false],
      is_do: [false],
      is_cod: [false],
      cod_value: ['0.00', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      total_package_no: ['', [Validators.required, Validators.max(999), Validators.pattern(AppConstant.VALIDATE.NUMBER)]],
      total_weight: ['0.5', [Validators.required, Validators.max(9999), Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],

      origin_address_id: [''],
      origin_shipper_name: ['', [Validators.required]],
      origin_shipper_address1: ['', [Validators.required]],
      origin_shipper_address2: [''],
      origin_shipper_postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      origin_shipper_city: ['', [Validators.required]],
      origin_shipper_state_province: ['', [Validators.required]],
      origin_shipper_country: ['MY', [Validators.required]],
      origin_shipper_contact_name: [''],
      origin_shipper_phone_no: ['', [Validators.required]],

      dest_address_id: [''],
      dest_receiver_name: ['', [Validators.required]],
      dest_receiver_address1: ['', [Validators.required]],
      dest_receiver_address2: [''],
      dest_receiver_postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      dest_receiver_city: ['', [Validators.required]],
      dest_receiver_state_province: ['', [Validators.required]],
      dest_receiver_country: ['MY', [Validators.required]],
      dest_receiver_contact_name: [''],
      dest_receiver_phone_no: ['', [Validators.required]]
    });

    this.gform = this.fb.group({
      description: ['', [Validators.required]],
      quantity: ['1', [Validators.required, Validators.max(9999), Validators.pattern(AppConstant.VALIDATE.NUMBER)]],
      value: ['0.00', [Validators.required, Validators.max(99999), Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      currency: ['MYR', [Validators.required]]
    });
  }

  setFormEdit() {
    const o = this.datax;
    if (o.status !== 'NEW') {
      this.allowEdit = false;
    }
    
    this.mform.patchValue({
      consignment_no: o.consignment_no,
      service_type: o.service_type,
      uom: o.packaging_type,
      pickup_date: o.pickup_date,
      customer_reference: o.customer_reference,
      is_insurance_req: o.is_insurance,
      is_cod: o.cod,
      cod_value: o.cod_value,
      total_package_no: o.total_package_no,
      total_weight: o.chargeable_weigth,

      origin_address_id: o.origin_address_id,
      origin_shipper_name: o.origin_shipper_name,
      origin_shipper_address1: o.origin_shipper_address1,
      origin_shipper_address2: o.origin_shipper_address2,
      origin_shipper_postcode: o.origin_shipper_postcode,
      origin_shipper_city: o.origin_shipper_city,
      origin_shipper_state_province: o.origin_shipper_state_province,
      origin_shipper_country: o.origin_shipper_country,
      origin_shipper_contact_name: o.origin_shipper_contact_name,
      origin_shipper_phone_no: o.origin_shipper_phone_no,

      dest_address_id: o.dest_address_id,
      dest_receiver_name: o.dest_receiver_name,
      dest_receiver_address1: o.dest_receiver_address1,
      dest_receiver_address2: o.dest_receiver_address2,
      dest_receiver_postcode: o.dest_receiver_postcode,
      dest_receiver_city: o.dest_receiver_city,
      dest_receiver_state_province: o.dest_receiver_state_province,
      dest_receiver_country: o.dest_receiver_country,
      dest_receiver_contact_name: o.dest_receiver_contact_name,
      dest_receiver_phone_no: o.dest_receiver_phone_no
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
      origin_shipper_postcode: o.company_post_code,
      origin_shipper_city: o.company_city,
      origin_shipper_state_province: o.company_state_province,
      origin_shipper_country: s,
      origin_shipper_contact_name: o.company_pic_full_name,
      origin_shipper_phone_no: o.company_pic_phone_number
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
    this.lookupService.listUOM().subscribe((res: any) => {
      this.uomList = res.data;
    });
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
      this.serviceList = this.data.company_service_list;
      this.setForm();
      this.loadShipment();
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed', 'Create Shipment');
    });
  }

  loadShipment() {
    if (_.isNull(this.id) || _.isUndefined(this.id)) {
      return;
    }

    this.shipmentService.getShipment(this.id).subscribe((res: any) => {
      this.datax = !_.isEmpty(res.data) ? res.data[0] : {};
      this.setFormEdit();
      if (!Helper.isEmpty(this.datax)) {
        this.shipmentPackage = this.datax.shipment_package_list;
        this.loadProductList();
      }
    },
    (error) => {
      this.toastr.error('Load Shipment Detail Failed', 'Create Shipment');
    });
  }

  loadProductList() {
    const ls = this.shipmentPackage;
    if (Helper.isEmpty(ls)) {
      return;
    }

    _.each(ls, (x) => {
      this.listGood.push({
        description: `${x.description}`,
        quantity: x.quantity,
        value: x.value,
        currency: x.currency
      });
    });
  }

  onGetAddressShipper() {
    if (this.isView) {
      return false;
    }

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
    if (this.isView) {
      return false;
    }

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
      origin_address_id: o.id,
      origin_shipper_name: o.full_name,
      origin_shipper_address1: o.address1,
      origin_shipper_address2: o.address2,
      origin_shipper_postcode: o.postcode,
      origin_shipper_city: o.city,
      origin_shipper_state_province: o.state_province,
      origin_shipper_country: s,
      origin_shipper_phone_no: o.phone_number
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
      dest_address_id: o.id,
      dest_receiver_name: o.full_name,
      dest_receiver_address1: o.address1,
      dest_receiver_address2: o.address2,
      dest_receiver_postcode: o.postcode,
      dest_receiver_city: o.city,
      dest_receiver_state_province: o.state_province,
      dest_receiver_country: s,
      dest_receiver_phone_no: o.phone_number
    });
  }

  setPostcodeValidator(country_code, field) {
    let o = _.find(this.countryList, { country_code: country_code });
    if (_.isUndefined(o)) {
      this.mform.get(field).setValidators([
        Validators.required
      ]);
      this.mform.updateValueAndValidity();
    }

    else if (!o.regrex) {
      this.mform.get(field).setValidators([
        Validators.required
      ]);
      this.mform.updateValueAndValidity();
    }

    else if (o.regrex) {
      this.mform.get(field).setValidators([
        Validators.required,
        Validators.pattern(o.regrex)
      ]);
      this.mform.updateValueAndValidity();
    }
  }

  onCountryChangeShipper() {
    this.setPostcodeValidator(this.f.origin_shipper_country.value, 'origin_shipper_postcode');
  }

  onCountryChangeReceiver() {
    this.setPostcodeValidator(this.f.dest_receiver_country.value, 'dest_receiver_postcode');
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
    // this.router.navigate(['/cit/shipment/detail', 4747]);
    // return;
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
    const f = this.f;
    if (f.is_insurance_req.value && Helper.isEmpty(this.listGood)) {
      this.toastr.error('Please add at least 1 Goods Information', 'Create Shipment');
      return;
    }

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
        uom: f.uom.value,
        product_list: []
      }
    });
    let orderamt = 0;
    _.each(this.listGood, (x) => {
      orderamt += x.value * x.quantity
    });
   
    let o = {
      id: 0,
      customer_reference: f.customer_reference.value,
      origin_address_id: f.origin_address_id.value,
      origin_shipper_address1: f.origin_shipper_address1.value,
      origin_shipper_address2: f.origin_shipper_address2.value,
      origin_shipper_address3: '',
      origin_shipper_address4: '',
      origin_shipper_postcode: f.origin_shipper_postcode.value,
      origin_shipper_city: f.origin_shipper_city.value,
      origin_shipper_state_province: f.origin_shipper_state_province.value,
      origin_shipper_district: '',
      origin_shipper_country: f.origin_shipper_country.value,
      origin_shipper_name: f.origin_shipper_name.value,
      origin_shipper_phone_no: f.origin_shipper_phone_no.value,
      origin_shipper_mobile_no: f.origin_shipper_phone_no.value,
      origin_shipper_contact_name: f.origin_shipper_contact_name.value,
      origin_shipper_email: '',

      dest_address_id: f.dest_address_id.value,
      dest_receiver_address1: f.dest_receiver_address1.value,
      dest_receiver_address2: f.dest_receiver_address2.value,
      dest_receiver_address3: '',
      dest_receiver_address4: '',
      dest_receiver_postcode: f.dest_receiver_postcode.value,
      dest_receiver_city: f.dest_receiver_city.value,
      dest_receiver_state_province: f.dest_receiver_state_province.value,
      dest_receiver_district: '',
      dest_receiver_country: f.dest_receiver_country.value,
      dest_receiver_name: f.dest_receiver_name.value,
      dest_receiver_phone_no: f.dest_receiver_phone_no.value,
      dest_receiver_mobile_no: '-',
      dest_receiver_contact_name: f.dest_receiver_contact_name.value,
      dest_receiver_email: '',

      cod: f.is_cod.value,
      cod_value: f.cod_value.value,
      carton_box_code: f.uom.value,
      total_package_no: f.total_package_no.value,
      service_type: f.service_type.value,
      order_amount : orderamt,
      is_insurance: f.is_insurance_req.value,
      insurance_amount: 30.00,
      chargeable_weight: f.total_weight.value,
      chargeable_weight_uom: 'KG',
      order_amount_currency: 'MYR',
      company_id: this.data.company_id,

      // chargeable_weight: f.total_weight.value,
      // chargeable_weight_uom: 'KG',
      shipment_package_list: lp
    };

    if (!_.isNull(f.pickup_date.value) && !_.isUndefined(f.pickup_date.value)) {
      o['pickup_date'] = Helper.getDateStr(f.pickup_date.value);
    }

    this.isloading = true;
    if (!this.isEdit) {
      this.shipmentService.createShipment(o).subscribe((res: any) => {
        this.isloading = false;
        this.toastr.success('New Shipment successfully created', 'Create Shipment');
        this.router.navigate(['/cit/shipment/detail', res.shipment_id]);
      },
      (error) => {
        this.isloading = false;
        if (error.status === 400 && error.error && error.error.message) {
          this.toastr.error(`Create Shipment Failed: ${error.error.message}`, 'Create Shipment');
        }
  
        else {
          this.toastr.error('Create Shipment Failed', 'Create Shipment');
        }
      });
    }
    
    else {
      o.id = this.datax.id;
      this.shipmentService.updateShipment(o).subscribe(res => {
        this.isloading = false;
        this.toastr.success('Shipment successfully updated', 'Update Shipment');
        this.isView = true;
        this.load();
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Update Shipment Failed', 'Update Shipment');
      });
    }
  }

  onPrintShipment() {
    if (_.isEmpty(this.datax)) {
      return;
    }

    if (!this.pdfstate) {
      this.isloading = true;
      this.shipmentService.printLabel(this.datax.consignment_no, AppConstant.PRINT_TYPE.NEWCONSIGNMENTNOTE).subscribe((res: any) => {
        this.isloading = false;
        const state = {
          pdfsrc: URL.createObjectURL(res),
          pdfblob: res,
          filename: `${this.datax.consignment_no}.pdf`
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

  get isPrintDisabled() {
    return this.isloading;
  }

  get service_type() {
    let p = this.datax.service_type;
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

  get packaging_type() {
    let p = this.datax.packaging_type;
    let s = p;
    if (Helper.isEmpty(p)) {
      return p;
    }

    let o = _.find(this.uomList, { code: p });
    if (!_.isUndefined(o)) {
      s = o.description;
    }

    return s;
  }

  get origin_shipper_country() {
    let country = this.datax.origin_shipper_country;
    let s = country;
    if (Helper.isEmpty(country)) {
      return country;
    }

    let o = _.find(this.countryList, { country_code: country });
    if (!_.isUndefined(o)) {
      s = o.country_name;
    }

    return s;
  }

  get dest_receiver_country() {
    let country = this.datax.dest_receiver_country;
    let s = country;
    if (Helper.isEmpty(country)) {
      return country;
    }

    let o = _.find(this.countryList, { country_code: country });
    if (!_.isUndefined(o)) {
      s = o.country_name;
    }

    return s;
  }
}
