import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LookupService } from '../../../services/lookup.service';
import { AddressBookService } from '../../../services/address-book.service';
import { AuthService } from '../../../services/auth.service';
import { AppConstant } from '../../../shared/constants/app.constant';
import { Helper } from '../../../shared/utils/helper';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-address-book',
  templateUrl: './create-address-book.component.html',
  styleUrls: ['./create-address-book.component.css']
})
export class CreateAddressBookComponent implements OnInit {

  countryList = [];
  mform: FormGroup;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private addressBookService: AddressBookService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.load();
  }

  createForm() {
    this.mform = this.fb.group({
      type: ['Sender', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      addr1: ['', [Validators.required]],
      addr2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      country: ['Malaysia', Validators.required],
      isdefault: [false]
    });
  }

  load() {
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
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
      type: this.f.type.value,
      country: this.f.country.value,
      address1: this.f.addr1.value,
      address2: this.f.addr2.value,
      postcode: this.f.postcode.value,
      state_province: this.f.state.value,
      city: this.f.city.value,
      district: '',
      full_name: this.f.name.value,
      phone_number: this.f.phone.value,
      is_default: this.f.isdefault.value
    };
    this.addressBookService.createAddressBook(o).subscribe(res => {
      this.toastr.success('New Address Book successfully created', 'Create Address Book');
      this.mform.patchValue({
        type: 'Sender',
        name: '',
        phone: '',
        addr1: '',
        addr2: '',
        city: '',
        state: '',
        postcode: '',
        isdefault: false
      });
    },
    (error) => {
      this.toastr.error('Create Address Book Failed', 'Create Address Book');
    });
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
