import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LookupService } from '../../services/lookup.service';
import { AuthService } from '../../services/auth.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from '../../shared/utils/helper';
import { AddressBookModalComponent } from '../../shared/components/address-book-modal/address-book-modal.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  countryList = [];
  mform: FormGroup;
  data: any;
  bsModalRef: BsModalRef;
  selectedAddress: any;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private authService: AuthService,
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
      company_code: new FormControl({ value: '', disabled: true }),
      company_name: new FormControl({ value: '', disabled: true }),
      userid: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      addr1: ['', [Validators.required]],
      addr2: [''],
      postcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['MY', [Validators.required]]
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
      company_code: o.company_code,
      company_name: o.company_name,
      userid: o.username,
      email: o.email,
      name: `${o.first_name} ${o.last_name}`,
      phone: o.phone_number,
      addr1: o.company_address1,
      addr2: o.company_address2,
      postcode: o.company_postcode,
      city: o.company_city,
      state: o.company_state_province,
      country: s
    });
  }

  load() {
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      this.loadUserProfile();
    });
  }

  loadUserProfile() {
    this.authService.getUserDetails().subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
      this.setForm();
    },
    (error) => {
      this.toastr.error('Load User Profile Failed', 'User Profile');
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
      addr1: o.address1,
      addr2: o.address2,
      postcode: o.postcode,
      city: o.city,
      state: o.state_province,
      country: s
    });
  }

  onCountryChange() {
    this.mform.get('postcode').setValidators([
      Validators.required,
      Validators.pattern(Helper.getPostcodePattern(this.f.country.value))
    ]);
    this.mform.updateValueAndValidity();
  }

  onSubmit() {
    const o = {

    };
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
