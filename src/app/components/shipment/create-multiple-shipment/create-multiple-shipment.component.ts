import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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

@Component({
  selector: 'app-create-multiple-shipment',
  templateUrl: './create-multiple-shipment.component.html',
  styleUrls: ['./create-multiple-shipment.component.css']
})
export class CreateMultipleShipmentComponent implements OnInit {

  isloading = false;
  serviceList = [];
  countryList = [];
  mform: FormGroup;
  data: any;
  bsModalRef: BsModalRef;
  selectedAddressShipper: any;
  uploadResponse: any = { status: '', message: '', filePath: '' };

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private shipmentService: ShipmentService,
    private companyService: CompanyService,
    private authService: AuthService,
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
      company_account_code: new FormControl({ value: '', disabled: true }, [Validators.required]),
      company_name: new FormControl({ value: '', disabled: true }),
      service_type: ['', [Validators.required]],
      currency: ['MYR', [Validators.required]],
      pickup_date: [new Date()],
      shipper_address_id: ['', [Validators.required]],
      origin_shipper_name: ['', [Validators.required]],
      file: [null]
    });
  }

  setForm() {
    const o = this.data;
    this.mform.patchValue({
      company_account_code: o.company_account_code,
      company_name: o.company_name
    });
  }

  load() {
    this.lookupService.listCountryInfo().subscribe((res: any) => {
      this.countryList = res.response;
      this.loadUserDetails();
    });
    this.lookupService.listService().subscribe((res: any) => {
      this.serviceList = res.data;
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

  setAddressShipper(o) {
    this.mform.patchValue({
      shipper_address_id: o.id,
      origin_shipper_name: o.full_name
    });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.mform.patchValue({
        file: file
      });
    }
  }

  onSubmit() {
    if (_.isNull(this.f.file.value) || _.isUndefined(this.f.file.value)) {
      this.toastr.error('Import File is required');
      return;
    }
    const f = this.f;
    const formData = new FormData();
    formData.append('file', this.mform.get('file').value);
    formData.append('company_account_code', f.company_account_code.value);
    formData.append('delivery_service', f.service_type.value);
    formData.append('currency', f.currency.value);
    formData.append('is_do', 'True');
    formData.append('shipper_address_id', f.shipper_address_id.value);

    if (!Helper.isEmpty(f.pickup_date.value) && !_.isNull(f.pickup_date.value) && !_.isUndefined(f.pickup_date.value)) {
      formData.append('pickup_date', Helper.getDateStr1(f.pickup_date.value));
    }

    //this.isloading = true;
    this.shipmentService.uploadShipment(formData).subscribe((res: any) => {
      this.uploadResponse = res;
      if (res.gotError === true) {
        this.toastr.error('Error Detected in Import File, please amend and re-upload', 'Upload Shipment');
      }

      else if (res.gotError === false) {
        this.toastr.success('Upload Shipment successful', 'Upload Shipment');
      }
      // this.isloading = false;
    },
    (error) => {
      //this.isloading = false;
      this.toastr.error('Upload Shipment Failed', 'Upload Shipment');
    })
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
}
