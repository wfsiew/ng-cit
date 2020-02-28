import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LookupService } from 'src/app/services/lookup.service';
import { RetailInboundService } from 'src/app/services/retail-inbound.service';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/utils/helper';
import { PrintShipmentModalComponent } from 'src/app/components/shipment/print-shipment-modal/print-shipment-modal.component';

@Component({
  selector: 'app-shipment-info-retail-inbound',
  templateUrl: './shipment-info-retail-inbound.component.html',
  styleUrls: ['./shipment-info-retail-inbound.component.css']
})
export class ShipmentInfoRetailInboundComponent implements OnInit {

  isloading = false;
  search = '';
  serviceList = [];
  countryList = [];
  uomList = [];
  mform: FormGroup;
  gform: FormGroup;
  data: any = {};
  company: any = {};
  id: string;
  listGood = [];
  shipmentPackage: any = {};
  bsModalRef: BsModalRef;
  isEdit = false;
  pdfstate = null;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private retailInboundService: RetailInboundService,
    private companyService: CompanyService,
    private msService: MessageService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location
  ) {
    let o = localStorage.getItem('shipment-info-retail-inbound');
    this.search = o;
    this.createForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!_.isNull(this.id)) {
        this.isEdit = true;
      }

      this.load();
    });
  }

  createForm() {
    this.mform = this.fb.group({
      company_account_code: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      consignment_no: new FormControl({ value: '', disabled: false }, [Validators.required]),
      service_type: ['', [Validators.required]],
      uom: ['', [Validators.required]],
      customer_reference: ['', [Validators.required]],
      order_amount: ['0'],
      is_insurance: [false],
      payment_type: ['cash', [Validators.required]],
      total_package_no: ['', [Validators.required, Validators.max(999), Validators.pattern(AppConstant.VALIDATE.NUMBER)]],
      total_weight: ['0.5', [Validators.required, Validators.max(9999), Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      dim_weight: ['0', [Validators.required, Validators.max(9999), Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      actual_weight: ['0', [Validators.required, Validators.max(9999), Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      total_amount: ['0', [Validators.required, Validators.pattern(AppConstant.VALIDATE.NUMBER)]],
      tax_amount: ['0', [Validators.required]],
      charges_amount: ['0', [Validators.required, Validators.pattern(AppConstant.VALIDATE.NUMBER)]],

      origin_shipper_name: ['', [Validators.required]],
      origin_shipper_address1: ['', [Validators.required]],
      origin_shipper_address2: [''],
      origin_shipper_postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      origin_shipper_city: ['', [Validators.required]],
      origin_shipper_state_province: ['', [Validators.required]],
      origin_shipper_country: ['MY', [Validators.required]],
      origin_shipper_contact_name: [''],
      origin_shipper_phone_no: ['', [Validators.required]],
      origin_shipper_email: [''],

      dest_receiver_name: ['', [Validators.required]],
      dest_receiver_address1: ['', [Validators.required]],
      dest_receiver_address2: [''],
      dest_receiver_postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      dest_receiver_city: ['', [Validators.required]],
      dest_receiver_state_province: ['', [Validators.required]],
      dest_receiver_country: ['MY', [Validators.required]],
      dest_receiver_contact_name: [''],
      dest_receiver_phone_no: ['', [Validators.required]],
      dest_receiver_email: [''],

      width: ['0', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      length: ['0', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      height: ['0', [Validators.required, Validators.pattern(AppConstant.VALIDATE.AMOUNT)]]
    });

    this.gform = this.fb.group({
      description: ['', [Validators.required]],
      quantity: ['1', [Validators.required, Validators.max(9999), Validators.pattern(AppConstant.VALIDATE.NUMBER)]],
      value: ['0.00', [Validators.required, Validators.max(99999), Validators.pattern(AppConstant.VALIDATE.AMOUNT)]],
      currency: ['MYR', [Validators.required]]
    });
  }

  setFormEdit() {
    const o = this.data;
    const c = this.company;
    this.search = o.consignment_no;
    this.mform.patchValue({
      company_account_code: c.company_account_code,
      company_name: c.company_name,
      consignment_no: o.consignment_no,
      service_type: o.service_type,
      uom: o.packaging_type,
      customer_reference: o.customer_reference,
      is_insurance: o.is_insurance,
      payment_type: _.isNull(o.payment_type) || o.payment_type === '' ? 'cash' : o.payment_type,
      total_package_no: o.total_package_no,
      total_weight: o.chargeable_weight,
      actual_weight: o.chargeable_weight,
      total_amount: o.total_amount,
      tax_amount: o.tax_amount,
      charges_amount: o.charges_amount,

      origin_shipper_name: o.origin_shipper_name,
      origin_shipper_address1: o.origin_shipper_address1,
      origin_shipper_address2: o.origin_shipper_address2,
      origin_shipper_postcode: o.origin_shipper_postcode,
      origin_shipper_city: o.origin_shipper_city,
      origin_shipper_state_province: o.origin_shipper_state_province,
      origin_shipper_country: o.origin_shipper_country,
      origin_shipper_contact_name: o.origin_shipper_contact_name,
      origin_shipper_phone_no: o.origin_shipper_phone_no,
      origin_shipper_email: Helper.replaceNone(o.origin_shipper_email),

      dest_receiver_name: o.dest_receiver_name,
      dest_receiver_address1: o.dest_receiver_address1,
      dest_receiver_address2: o.dest_receiver_address2,
      dest_receiver_postcode: o.dest_receiver_postcode,
      dest_receiver_city: o.dest_receiver_city,
      dest_receiver_state_province: o.dest_receiver_state_province,
      dest_receiver_country: o.dest_receiver_country,
      dest_receiver_contact_name: o.dest_receiver_contact_name,
      dest_receiver_phone_no: o.dest_receiver_phone_no,
      dest_receiver_email: Helper.replaceNone(o.dest_receiver_email)
    });
  }

  setForm() {
    this.mform.patchValue({
      company_account_code: '',
      company_name: ''
    });
  }

  load() {
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      this.loadShipment();
    });
    this.lookupService.listService().subscribe((res: any) => {
      this.serviceList = res.data;
    });
  }

  loadCompanyProfile(id) {
    if (_.isNull(id) || _.isUndefined(id)) {
      this.setFormEdit();
      this.loadProductList();
      return;
    }

    this.companyService.getCompany(id).subscribe((res: any) => {
      this.company = !_.isEmpty(res.data) ? res.data[0] : {};
      this.setFormEdit();
      this.loadProductList();
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed', 'Retail Inbound');
    });
  }

  loadAmount() {
    let o = {
      id: this.data.id,
      amount: this.f.order_amount.value
    };
    this.retailInboundService.getCharges(o).subscribe((res: any) => {
      const x = res.data;
      this.mform.patchValue({
        total_amount: x.total_amount,
        tax_amount: x.tax_amount,
        charges_amount: x.charges_amount
      });
    },
    (error) => {
      this.toastr.error('Load Charges Failed', 'Retail Inbound');
    });
  }

  loadQuotations() {
    const f = this.f;
    let o = {
      sender_post_code: f.origin_shipper_postcode.value,
      receiver_post_code: f.dest_receiver_postcode.value,
      sender_country: f.origin_shipper_country.value,
      receiver_country: f.dest_receiver_country.value,
      sender_state: f.origin_shipper_state_province.value,
      receiver_state: f.dest_receiver_state_province.value,
      weight: Number(f.total_weight.value)
    };
    this.retailInboundService.getQuotations(o).subscribe((res: any) => {
      const lx = res.status ? res.data : [];
      const ls = !_.isEmpty(lx) ? lx[0].service_list : {};
      if (!Helper.isEmpty(ls)) {
        let k = _.find(ls, (k) => {
          return k.service_type === f.service_type.value;
        });
        this.mform.patchValue({
          order_amount: k.price
        });
        this.loadAmount();
      }
    },
    (error) => {
      this.toastr.error('Load Quotations Failed', 'Retail Inbound');
    });
  }

  loadShipment() {
    if (_.isNull(this.id) || _.isUndefined(this.id)) {
      return;
    }

    this.isloading = true;
    this.retailInboundService.getRetailInboundShipment(this.id).subscribe((res: any) => {
      this.isloading = false;
      this.data = !_.isEmpty(res.data) ? res.data : {};
      if (!Helper.isEmpty(this.data)) {
        this.shipmentPackage = this.data.shipment_package_list;
        this.loadCompanyProfile(this.data.company_id);
      }
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load Shipment Detail Failed', 'Retail Inbound');
    });
  }

  loadProductList() {
    this.listGood = [];
    const ls = this.shipmentPackage;
    if (Helper.isEmpty(ls)) {
      return;
    }

    const x = ls[0];
    if (Helper.isEmpty(x)) {
      return;
    }

    this.mform.patchValue({
      width: x.width,
      length: x.length,
      height: x.height
    });

    this.setWeight(x.width, x.length, x.height);

    const lx = ls[0].product_list;
    if (Helper.isEmpty(lx)) {
      return;
    }

    _.each(lx, (x) => {
      this.listGood.push({
        id: x.id,
        description: x.description,
        quantity: x.quantity,
        value: x.value,
        currency: x.currency
      });
    });
  }

  onActualWeightChange() {
    if (_.isNull(this.f.actual_weight.value) || this.f.actual_weight.value === '' || !AppConstant.VALIDATE.AMOUNT) {
      return;
    }
    
    let dim_weight = Number(this.f.dim_weight.value);
    let actual_weight = Number(this.f.actual_weight.value);
    let charge_weight = Number(this.f.total_weight.value);

    if (actual_weight > dim_weight) {
      charge_weight = actual_weight;
    }

    else {
      charge_weight = dim_weight;
    }

    this.mform.patchValue({
      actual_weight: actual_weight.toFixed(2),
      total_weight: charge_weight.toFixed(2)
    });

    this.loadQuotations();
  }

  onWidthLengthHeightChange() {
    let width = this.f.width.value;
    let length = this.f.length.value;
    let height = this.f.height.value;
    this.setWeight(width, length, height);
  }

  onPostcodeChange() {
    this.loadQuotations();
  }

  setWeight(width, length, height) {
    if (_.isNull(width) || width === '' || !AppConstant.VALIDATE.AMOUNT.test(width) ||
      _.isNull(length) || length === '' || !AppConstant.VALIDATE.AMOUNT.test(length) ||
      _.isNull(height) || height === '' || !AppConstant.VALIDATE.AMOUNT.test(height)) {
      return;
    }

    const o = this.data;
    let dim_weight = 0;
    let actual_weight = _.isNull(o.chargeable_weight) ? 0 : o.chargeable_weight;
    let charge_weight = 0;

    if (o.origin_shipper_country === 'MY' && o.dest_receiver_country === 'MY') {
      dim_weight = Number(width) * Number(length) * Number(height) / 6000;
    }

    else {
      dim_weight = Number(width) * Number(length) * Number(height) / 5000;
    }

    if (actual_weight > dim_weight) {
      charge_weight = actual_weight;
    }

    else {
      charge_weight = dim_weight;
    }

    this.mform.patchValue({
      dim_weight: dim_weight.toFixed(2),
      actual_weight: actual_weight.toFixed(2),
      total_weight: charge_weight.toFixed(2)
    });

    this.loadQuotations();
  }

  setPostcodeValidator(country_code, regrex, field) {
    if (_.isNull(country_code) || _.isUndefined(country_code)) {
      this.mform.get(field).setValidators([
        Validators.required
      ]);
      this.mform.updateValueAndValidity();
    }

    else if (!regrex) {
      this.mform.get(field).setValidators([
        Validators.required
      ]);
      this.mform.updateValueAndValidity();
    }

    else if (regrex) {
      this.mform.get(field).setValidators([
        Validators.required,
        Validators.pattern(regrex)
      ]);
      this.mform.updateValueAndValidity();
    }
  }

  onCountryChangeShipper(event) {
    this.setPostcodeValidator(event.country_code, event.regrex, 'origin_shipper_postcode');
    this.loadQuotations();
  }

  onCountryChangeReceiver(event) {
    this.setPostcodeValidator(event.country_code, event.regrex, 'dest_receiver_postcode');
    this.loadQuotations();
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

  onSave() {
    const f = this.f;
    let lp = _.map(this.listGood, (x) => {
      return {
        id: x.id,
        value: x.value,
        currency: x.currency,
        quantity: x.quantity,
        description: x.description
      }
    });
    let lsp = [];
    if (lp.length > 0) {
      let x = lp[0];
      lsp = [
        {
          description: x.description,
          weight: 0.00,
          volume: 0.00,
          height: f.height.value,
          length: f.length.value,
          width: f.width.value,
          value: x.value,
          currency: x.currency,
          quantity: x.quantity,
          uom: f.uom.value,
          product_list: lp
        }
      ];
    }

    let o = {
      id: this.data.id,
      service_type: f.service_type.value,
      customer_reference: f.customer_reference.value,
      is_insurance: f.is_insurance.value,
      payment_type: f.payment_type.value,
      total_package_no: f.total_package_no.value,
      chargeable_weight: f.total_weight.value,
      dim_weight: f.dim_weight.value,
      actual_weight: f.actual_weight.value,
      total_amount: f.total_amount.value,
      tax_amount: f.tax_amount.value,
      charges_amount: f.charges_amount.value,

      origin_shipper_address1: f.origin_shipper_address1.value,
      origin_shipper_address2: f.origin_shipper_address2.value,
      origin_shipper_postcode: f.origin_shipper_postcode.value,
      origin_shipper_city: f.origin_shipper_city.value,
      origin_shipper_state_province: f.origin_shipper_state_province.value,
      origin_shipper_country: f.origin_shipper_country.value,
      origin_shipper_name: f.origin_shipper_name.value,
      origin_shipper_phone_no: f.origin_shipper_phone_no.value,
      origin_shipper_email: f.origin_shipper_email.value,

      dest_receiver_address1: f.dest_receiver_address1.value,
      dest_receiver_address2: f.dest_receiver_address2.value,
      dest_receiver_postcode: f.dest_receiver_postcode.value,
      dest_receiver_city: f.dest_receiver_city.value,
      dest_receiver_state_province: f.dest_receiver_state_province.value,
      dest_receiver_country: f.dest_receiver_country.value,
      dest_receiver_name: f.dest_receiver_name.value,
      dest_receiver_phone_no: f.dest_receiver_phone_no.value,
      dest_receiver_email: f.dest_receiver_email.value,

      order_amount: 99,
      order_amount_currency: 'MYR',
      company_id: this.data.company_id,
      width: f.width.value,
      length: f.length.value,
      height: f.height.value,
      shipment_package_list: lsp
    };

    this.isloading = true;
    this.retailInboundService.updateRetailInboundShipment(o).subscribe((res: any) => {
      this.isloading = false;
      this.toastr.success('Shipment successfully updated', 'Retail Inbound');
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Update Shipment Failed', 'Retail Inbound');
    });
  }

  onConfirm() {
    this.isloading = true;
    let o = { id: this.data.id };
    this.retailInboundService.confirmRetailInboundShipment(o).subscribe((res: any) => {
      this.isloading = false;
      this.toastr.success('Shipment confirmed');
      this.data.is_confirm = true;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Confirm Shipment Failed');
    });
  }

  onClose() {
    this.loc.back();
  }

  onPrintShipment() {

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
}
