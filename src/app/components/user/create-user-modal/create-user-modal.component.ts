import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/models/user';
import { Helper } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css']
})
export class CreateUserModalComponent implements OnInit {

  title: string;
  user_id: string;
  invitation_id: string;
  email: string = '';
  roles: string = 'USER';
  type: number;
  company_id: string = '';
  edit = false;
  canEdit = false;
  mform: FormGroup;
  user: User;

  public onClose: Subject<any>;
  readonly ROLE = AppConstant.ROLE;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    private authService: AuthService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.user = this.authService.loadUser();
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
      company_id: this.company_id,
      email: f.email,
      user_role: f.user_type
    };
    this.companyService.assignUser(o).subscribe((res: any) => {
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
    this.userService.deletePendingUser(this.invitation_id).subscribe((res: any) => {
      if (res.status === true) {
        this.onClose.next({ result: true });
        this.toastr.success('User succesfully deleted');
        this.bsModalRef.hide();
      }

      else {
        this.toastr.error('Delete User Failed');
      }
    },
    (error) => {
      if (error.status === 400 && error.error && error.error.message) {
        this.toastr.error(`Delete User Failed: ${error.error.message}`);
      }

      else {
        this.toastr.error('Delete User Failed');
      }
    });
  }

  onDeactivate() {
    this.userService.deleteUser(this.user_id).subscribe((res: any) => {
      if (res.status === true) {
        this.onClose.next({ result: true });
        this.toastr.success('User succesfully deactivated');
        this.bsModalRef.hide();
      }

      else {
        this.toastr.error('Deactivate User Failed');
      }
    },
    (error) => {
      if (error.status === 400 && error.error && error.error.message) {
        this.toastr.error(`Deactivate User Failed: ${error.error.message}`);
      }

      else {
        this.toastr.error('Deactivate User Failed');
      }
    });
  }

  onActivate() {
    this.userService.activateUser(this.user_id).subscribe((res: any) => {
      if (res.status === true) {
        this.onClose.next({ result: true });
        this.toastr.success('User succesfully activated');
        this.bsModalRef.hide();
      }

      else {
        this.toastr.error(`Activate User Failed: ${res.message}`);
      }
    },
    (error) => {
      this.toastr.error(`Deactivate User Failed`);
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
