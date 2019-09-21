import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AppConstant } from '../../../shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css']
})
export class CreateUserModalComponent implements OnInit {

  title: string;
  email: string = '';
  roles: string = 'USER';
  company_id: string;
  edit = false;
  mform: FormGroup;

  public onClose: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.createForm();
  }

  createForm() {
    this.edit = Helper.isEmpty(this.email) ? false : true;
    this.mform = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      user_type: [this.roles, [Validators.required]]
    });
  }

  onAssign() {
    const f = this.mform.value;
    const o = {
      company_id: '',
      email: f.email,
      user_role: f.user_type
    };
    this.userService.createUser(o).subscribe((res: any) => {
      this.onClose.next({ result: true });
      this.toastr.success('New User succesfully created');
      this.bsModalRef.hide();
    },
    (error) => {
      this.toastr.error('Create User Failed', 'Create User');
    });
  }

  onConfirm() {
    this.bsModalRef.hide();
  }

  onDelete() {
    this.bsModalRef.hide();
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
