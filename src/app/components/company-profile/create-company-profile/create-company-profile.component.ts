import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LookupService } from '../../../services/lookup.service';
import { CompanyService } from '../../../services/company.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from '../../../shared/utils/helper';
import { AddressBookModalComponent } from '../../../shared/components/address-book-modal/address-book-modal.component';

@Component({
  selector: 'app-create-company-profile',
  templateUrl: './create-company-profile.component.html',
  styleUrls: ['./create-company-profile.component.css']
})
export class CreateCompanyProfileComponent implements OnInit {

  countryList = [];
  serviceList = [];
  mform: FormGroup;
  data: any = {
    company_service_list: []
  }
  service: any;
  bsModalRef: BsModalRef;
  selectedAddress: any;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.load();
  }

  createForm() {
    this.mform = this.fb.group({
      company_account_code: [''],
      company_pic_full_name: [''],
      company_name: [''],
      company_pic_email: [''],
      company_code: [''],
      company_pic_phone_number: [''],
      company_address1: [''],
      company_address2: [''],
      company_postcode: [''],
      company_city: [''],
      company_state_province: [''],
      company_country: [''],
      is_do: [false],
      is_cod: [false],
      parent_company_account_code: [''],
      cdefault: ['A4']
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
      company_pic_full_name: o.company_pic_full_name,
      company_name: o.company_name,
      company_pic_email: o.company_pic_email,
      company_code: o.company_code,
      company_pic_phone_number: o.company_pic_phone_number,
      company_address1: o.company_address1,
      company_address2: o.company_address2,
      company_postcode: o.company_postcode,
      company_city: o.company_city,
      company_state_province: o.company_state_province,
      company_country: s,
      is_do: o.is_do,
      is_cod: o.is_cod,
      parent_company_account_code: o.parent_company_account_code,
      cdefault: o.company_label_default
    });
    alert(o.company_label_default)
  }

  load() {
    this.lookupService.listService().subscribe((res: any) => {
      this.serviceList = res.data;
    });
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      this.loadCompanyProfile();
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

  onGetAddress() {
    const state = {
      title: 'Address Book'
    };
    this.bsModalRef = this.modalService.show(AddressBookModalComponent, { initialState: state });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(res => {
      if (res.result === true) {
        this.selectedAddress = res.data;
        this.setAddress(res.data);
      }

      else {
        this.selectedAddress = {};
      }
    });
    return false;
  }

  setAddress(o) {
    let s = o.country;
    let k = _.find(this.countryList, (x) => {
      return x.country_code === s;
    });
    if (_.isUndefined(k)) {
      s = 'MY';
    }
    this.mform.patchValue({
      company_pic_full_name: o.full_name,
      company_address1: o.address1,
      company_address2: o.address2,
      company_postcode: o.postcode,
      company_city: o.city,
      company_state_province: o.state_province,
      company_country: s
    });
  }

  onCountryChange() {
    this.mform.get('company_postcode').setValidators([
      Validators.required,
      Validators.pattern(Helper.getPostcodePattern(this.f.company_country.value))
    ]);
    this.mform.updateValueAndValidity();
  }

  addService() {
    let lx = this.data.company_service_list;
    let i = _.findIndex(lx, (x) => {
      return x.service_id === this.service.id;
    });
    if (i >= 0) {
      return;
    }

    lx.push({
      service_id: this.service.id,
      service_code: this.service.code
    });
  }

  removeService() {
    let lx = this.data.company_service_list;
    this.data.company_service_list = lx.filter(x => !x.selected);
  }

  onChangeSelect(o) {
    o.selected = !o.selected;
  }

  onDeleteSelected() {
    const x = this.data;
    // const o = {
    //   company_id: x.company_id,
    //   service_list: this.listSelected
    // };
    // this.companyService.updateCompanyAndService(o).subscribe(res => {
    //   this.selectAll = false;
    //   this.listSelected = [];
    //   this.load();
    // },
    // (error) => {
    //   this.toastr.error('Delete Service Failed', 'Delete Company Service');
    // });
  }

  onSubmit() {
    
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
