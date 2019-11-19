import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { LookupService } from 'src/app/services/lookup.service';
import { AddressBookService } from 'src/app/services/address-book.service';
import { MessageService } from 'src/app/services/message.service';
import { Helper } from 'src/app/shared/utils/helper';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-address-book',
  templateUrl: './create-address-book.component.html',
  styleUrls: ['./create-address-book.component.css']
})
export class CreateAddressBookComponent implements OnInit {

  isloading = false;
  countryList = [];
  mform: FormGroup;
  data: any;
  id: string;
  isEdit = false;
  isView = false;
  title = 'Create';
  privateval = '0';
  subs: Subscription;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private addressBookService: AddressBookService,
    private msService: MessageService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.privateval = params['private'];
    });
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.isView = params.get('view') === '0' ? true : false;
      if (!_.isNull(this.id)) {
        this.isEdit = true;
        this.title = 'Edit';
      }

      this.load();
    });

    // this.route.queryParamMap.subscribe(params => {
    //   this.isEdit = params.get('edit') === '1' ? true : false;
    //   if (this.isEdit) {
    //     this.title = 'Edit';
    //     let o = localStorage.getItem('edit-address-book');
    //     if (!_.isNull(o)) {
    //       let s = JSON.parse(o);
    //       this.data = s;
    //     }
    //   }

    //   this.load();
    // });
  }

  createForm() {
    this.mform = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      addr1: ['', [Validators.required]],
      addr2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postcode: ['', [Validators.required, Validators.pattern(Helper.getPostcodePattern('MY'))]],
      country: ['MY', Validators.required],
      isdefault: [false],
      isprivate: [false]
    });
  }

  setForm() {
    const o = this.data;
    this.mform.patchValue({
      name: o.full_name,
      phone: o.phone_number,
      addr1: o.address1,
      addr2: o.address2,
      city: o.city,
      state: o.state_province,
      postcode: o.postcode,
      country: o.country,
      isdefault: o.is_default,
      isprivate: o.is_private
    });
  }

  load() {
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      if (this.isEdit) {
        this.loadAddressBook();
      }
    });
  }

  loadAddressBook() {
    this.addressBookService.getAddressBook(this.id, this.privateval).subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
      this.setForm();
    },
    (error) => {
      this.toastr.error('Load Address Book Failed', 'Edit Address Book');
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

  onCountryChange() {
    this.setPostcodeValidator(this.f.country.value, 'postcode');
  }

  onSubmit() {
    const f = this.mform.value;
    let o = {
      id: 0,
      type: '',
      country: f.country,
      address1: f.addr1,
      address2: f.addr2,
      postcode: f.postcode,
      state_province: f.state,
      city: f.city,
      district: '',
      full_name: f.name,
      phone_number: f.phone,
      is_default: f.isdefault,
      is_private: f.isprivate
    };
    this.isloading = true;
    if (!this.isEdit) {
      this.addressBookService.createAddressBook(o).subscribe(res => {
        this.isloading = false;
        this.toastr.success('New Address Book successfully created', 'Create Address Book');
        this.mform.patchValue({
          name: '',
          phone: '',
          addr1: '',
          addr2: '',
          city: '',
          state: '',
          postcode: '',
          isdefault: false,
          isprivate: false
        });
        this.router.navigate(['/cit/address-book/list']);
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Create Address Book Failed', 'Create Address Book');
      });
    }
    
    else {
      o.id = this.data.id;
      this.addressBookService.updateAddressBook(o).subscribe(res => {
        this.isloading = false;
        this.toastr.success('Address Book successfully updated', 'Update Address Book');
        this.onBack();
      },
      (error) => {
        this.isloading = false;
        this.toastr.error('Update Address Book Failed', 'Update Address Book');
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
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }

  get country() {
    let country = this.data.country;
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
