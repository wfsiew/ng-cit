import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/shared/validators/custom-validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  mform: FormGroup;
  isView = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.mform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]],
      cpwd: ['', [Validators.required]]
    },
    {
      validator: CustomValidator.passwordMatch
    });
  }

  onSubmit() {
    const f = this.mform.value;
    let o = {
      email: f.email,
      new_password: f.pwd,
      confirm_password: f.cpwd
    };
    this.authService.resetPassword(o).subscribe(res => {
      this.toastr.success('Your password successfully changed');
      this.isView = true;
    },
    (error) => {
      this.toastr.error('Your password failed to be changed');
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
