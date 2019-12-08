import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/shared/validators/custom-validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

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
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]],
      cpwd: ['', [Validators.required]]
    },
    {
      validator: CustomValidator.passwordMatch
    });
  }

  onSubmit() {

  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
