import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/shared/validators/custom-validator';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent implements OnInit {

  isloading = false;
  mform: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.mform = this.fb.group({
      opwd: ['', [Validators.required]],
      pwd: ['', [Validators.required]],
      cpwd: ['', [Validators.required]]
    },
    {
      validator: CustomValidator.passwordMatch
    });
  }

  onSubmit() {
    const f = this.mform.value;
    const o = {
      old_password: f.opwd,
      new_password: f.pwd,
      confirm_password: f.cpwd
    };
    this.isloading = true;
    this.userService.changePwd(o).subscribe(res => {
      this.isloading = false;
      this.toastr.success('Password successfully changed');
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Change Password Failed');
    });
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid;
  }
}
