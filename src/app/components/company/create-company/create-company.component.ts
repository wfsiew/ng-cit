import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LookupService } from 'src/app/services/lookup.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/utils/helper';
import { User } from 'src/app/shared/models/user';
import { AddressBookModalComponent } from 'src/app/shared/components/address-book-modal/address-book-modal.component';
import { AppConstant } from 'src/app/shared/constants/app.constant';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent implements OnInit {

  isloading = false;
  companyList = [];
  countryList = [];
  serviceList = [];
  mform: FormGroup;
  data: any = {
    company_service_list: []
  }
  service: any;
  bsModalRef: BsModalRef;
  selectedAddress: any;
  id: string;
  isEdit = false;
  canEdit = false;
  user: User;
  parent_company_id = null;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private companyService: CompanyService,
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private loc: Location
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!_.isNull(this.id)) {
        this.isEdit = true;
      }

      this.loadUser();
    });
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
      display_name: o.display_name,
      company_pic_email: o.company_pic_email,
      company_code: o.company_code,
      company_pic_phone_number: o.company_pic_phone_number,
      company_address1: o.company_address1,
      company_address2: o.company_address2,
      company_postcode: o.company_post_code,
      company_city: o.company_city,
      company_state_province: o.company_state_province,
      company_country: s,
      is_do: o.is_do,
      is_cod: o.is_cod,
      parent_company_account_code: o.parent_company_account_code,
      cdefault: o.company_label_default
    });
  }

  loadUser() {
    this.user = this.authService.loadUser();
    this.canEdit = this.user.role === AppConstant.ROLE.ADMIN;
    this.load();
  }

  load() {
    this.companyService.listCompany(1, 100000, 'company_account_code', '').subscribe((res: any) => {
      this.companyList = res.data;
    });
    this.lookupService.listService().subscribe((res: any) => {
      this.serviceList = res.data;
    });
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      if (this.isEdit) {
        this.loadCompanyProfile();
      }
    });
  }

  loadCompanyProfile() {
    this.companyService.getCompany(this.id).subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
      this.setForm();
    },
    (error) => {
      this.toastr.error('Load Company Failed', 'Edit Company');
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
      company_pic_email: o.email,
      company_pic_phone_number: o.phone_number,
      company_address1: o.address1,
      company_address2: o.address2,
      company_postcode: o.postcode,
      company_city: o.city,
      company_state_province: o.state_province,
      company_country: s
    });
  }

  onParentCompanyChange() {
    const x = this.f.parent_company_account_code.value;
    let o = _.find(this.companyList, (k) => {
      return k.account_code === x;
    });
    this.parent_company_id = o.company_id;
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

  onCountryChange() {
    this.setPostcodeValidator(this.f.company_country.value, 'company_postcode');
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
      service_code: this.service.code,
      service_description: this.service.description
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
    const f = this.mform.value;
    let address_id = this.data.address;
    if (this.selectedAddress) {
      address_id = this.selectedAddress.id;
    }

    let lx = _.map(this.data.company_service_list, (k) => {
      return {
        service_id: k.service_id,
        service_code: k.service_code
      };
    });
    const o = {
      company_id: 0,
      company_account_code: f.company_account_code,
      company_code: f.company_code,
      company_name: f.company_name,
      display_name: f.display_name,
      parent_company_account_code: f.parent_company_account_code,
      parent_company_id : this.parent_company_id,
      is_do: f.is_do,
      is_cod: f.is_cod,
      is_active: true,
      label_default: f.cdefault,
      address_id: address_id,
      address: address_id,
      company_service_list: lx
    };
    this.isloading = true;
    if (!this.isEdit) {
      this.companyService.createCompany(o).subscribe(res => {
        this.isloading = false;
        this.toastr.success('New Company successfully created', 'Create Company');
        this.onBack();
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Create Company Failed', 'Create Company');
      });
    }
    
    else {
      o.company_id = this.data.company_id;
      this.companyService.updateCompany(o).subscribe(res => {
        this.isloading = false;
        this.toastr.success('Company successfully updated', 'Update Company');
        this.onBack();
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Update Company Failed', 'Update Company');
      });
    }
  }

  onBack() {
    this.loc.back();
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    if (!this.selectedAddress.id) {
      return true;
    }
    
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
