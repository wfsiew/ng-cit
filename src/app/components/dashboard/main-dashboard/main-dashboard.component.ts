import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { MessageService } from '../../../services/message.service';
import { AppConstant } from '../../../shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  isloading = false;
  list = [];
  data = {
    new: 0,
    pending: 0,
    delivered: 0,
    cancel: 0
  }

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.list = [
      {
        code: 'A100177',
        company_name: 'Alibaba'
      }
    ]
    this.load();
  }

  load() {
    this.isloading = true;
    this.dashboardService.getKPI('11b91530-b4e8-4b47-b3d3-e6d4e31077a9').subscribe((res: any) => {
      const o = res.status ? res.data.overview : [];
      let m = {
        'new': 0,
        'pending': 0,
        'delivered': 0,
        'cancel': 0
      }

      _.each(['new', 'pending', 'delivered', 'cancel'], (k) => {
        let x = _.find(o, (j) => {
          return j.status === k.toUpperCase();
        });
        if (!_.isUndefined(x)) {
          m[k] = x.number;
        }
      });

      this.data = m;

      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load KPI Failed');
    });
  }

  onKPI(i) {
    this.router.navigate(['/cit/dashboard/list', i]);
    return false;
  }

  onViewDetails(o) {
    return false;
  }

  onViewDashboard(o) {
    return false;
  }
}
