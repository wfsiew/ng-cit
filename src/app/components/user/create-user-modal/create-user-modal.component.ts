import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  edit = false;
  mform: FormGroup;

  public onClose: Subject<any>;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.createForm();
  }

  createForm() {
    this.edit = this.email === '' ? false : true;
    this.mform = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      user_type: [this.roles, [Validators.required]]
    });
  }

  onAssign() {
    this.onClose.next({ result: true });
    this.bsModalRef.hide();
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
