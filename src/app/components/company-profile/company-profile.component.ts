import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../shared/utils/helper';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  mform: FormGroup;
  data: any;
  selectAll = false;
  listSelected = [];

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.load();
  }

  createForm() {
    this.mform = this.fb.group({
      company_code: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      parent_company_name: ['', [Validators.required]]
    });
  }

  setForm() {
    const o = this.data;
    this.mform.patchValue({
      company_code: o.company_code,
      company_name: o.company_name,
      display_name: o.display_name,
      parent_company_name: o.parent_company_name
    });
  }

  load() {
    this.companyService.getCompanyDetails().subscribe((res: any) => {
      this.data = !_.isEmpty(res.data) ? res.data[0] : {};
      this.setForm();
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed', 'Company Detail');
    });
  }

  onChangeSelectAll() {
    this.selectAll = !this.selectAll;
    this.listSelected = [];
    _.each(this.data.company_service_list, (o) => {
      o.selected = this.selectAll;
      if (!o.selected) {
        this.listSelected = this.listSelected.filter(x => x !== o.service_id);
      }

      else {
        this.listSelected.push(o.service_id);
      }
    });
  }

  onChangeSelect(o) {
    o.selected = !o.selected;
    if (!o.selected) {
      this.listSelected = this.listSelected.filter(x => x !== o.service_id);
    }

    else {
      this.listSelected.push(o.service_id);
    }
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

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
