import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LookupService } from 'src/app/services/lookup.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/utils/helper';
import { AddressBookModalComponent } from 'src/app/shared/components/address-book-modal/address-book-modal.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  isloading = false;
  countryList = [];
  mform: FormGroup;
  data: any;
  bsModalRef: BsModalRef;
  selectedAddress: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private lookupService: LookupService,
    private authService: AuthService,
    private userService: UserService,
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
      username: new FormControl({ value: '', disabled: true }),
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      date_of_birth: [null, [Validators.required]],
      addr1: new FormControl({ value: '', disabled: true }),
      addr2: new FormControl({ value: '', disabled: true }),
      postcode: new FormControl({ value: '', disabled: true }),
      city: new FormControl({ value: '', disabled: true }),
      state: new FormControl({ value: '', disabled: true }),
      country: new FormControl({ value: '', disabled: true })
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
      userid: o.id,
      username: o.username,
      first_name: o.first_name,
      last_name: o.last_name,
      email: o.email,
      phone: o.phone_number,
      date_of_birth: new Date(o.date_of_birth),
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
    const x = this.data;
    const f = this.mform.value;
    const o = {
      first_name: f.first_name,
      last_name: f.last_name,
      email: f.email,
      phone_number: f.phone,
      date_of_birth: Helper.getDateStr(f.date_of_birth),
      is_active: x.is_active,
      company_id: x.company_id,
      username: x.username,
      user_id: x.id
    };
    this.isloading = true;
    this.userService.updateUser(o).subscribe((res: any) =>{
      this.isloading = false;
      this.toastr.success('Profile successfully updated');
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Update Profile Failed');
    });
  }

  onChangePwd() {
    this.router.navigate(['/cit/change-pwd']);
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
