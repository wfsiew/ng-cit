import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
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
  list_tracking = [];
  consignment_no: string;
  data: any = {};

  constructor(
    private route: ActivatedRoute,
    private loc: Location,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.consignment_no = params.get('consignment_no');
      this.load();
    });
  }

  load() {
    this.isloading = true;
    this.dashboardService.getShipmentDetailByConsignment(this.consignment_no).subscribe((res: any) => {
      this.list = res.status ? res.details : [];
      this.list_tracking = res.status ? res.history: [];
      this.data = res.status ? res.details[0] : {};
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load Shipment Detail Failed');
    });
  }

  onBack() {
    this.loc.back();
  }

  get podimage() {
    return `http://citflask.fmx.asia//dashboard/image/${this.consignment_no}`;
  }

  get doimage() {
    return `http://citflask.fmx.asia//dashboard/image/do/${this.consignment_no}`;
  }
}
