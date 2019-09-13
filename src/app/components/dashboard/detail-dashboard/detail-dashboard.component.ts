import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-dashboard',
  templateUrl: './detail-dashboard.component.html',
  styleUrls: ['./detail-dashboard.component.css']
})
export class DetailDashboardComponent implements OnInit {

  isloading = false;
  list = [];

  constructor(
    private route: ActivatedRoute,
    private loc: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.loc.back();
  }
}
