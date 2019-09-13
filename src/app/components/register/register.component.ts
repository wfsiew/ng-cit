import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from '../../shared/validators/custom-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isloading = false;
  mform: FormGroup;
  serial_id: string;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.serial_id = params.get('serial_id');
    });
  }

  createForm() {
    this.mform = this.fb.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      pwd: ['', [Validators.required]],
      cpwd: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['']
    },
    {
      validator: CustomValidator.passwordMatch
    });
  }

  onSubmit() {
    const f = this.f;
    const o = {
      password: f.pwd.value,
      first_name: f.first_name.value,
      last_name: f.last_name.value,
      email: f.email.value,
      username: f.username.value,
      phone_number: f.phone_number.value,
      date_of_birth: null,
      serial_id: this.serial_id
    };
    this.isloading = true;
    this.userService.createUser(o).subscribe(res => {
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Create User Failed', 'Create User');
    })
  }

  get f() {
    return this.mform.controls;
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }
}
