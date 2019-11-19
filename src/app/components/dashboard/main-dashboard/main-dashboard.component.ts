import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  itemsCount = 0;
  page = 1;
  sort = 'company_account_code';
  sort_dir = 'desc';
  data = {
    new: 0,
    pending: 0,
    delivered: 0,
    cancel: 0
  }
  user = {
    company_id: '',
    company_name: ''
  }
  company_id: string;
  role: string;
  daterx = [new Date(), new Date()];
  datex = this.daterx;
  subs: Subscription;

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private companyService: CompanyService,
    private authService: AuthService,
    private msService: MessageService,
    private toastr: ToastrService
  ) {
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'main-dashboard') {
        const o = res.data;
        this.company_id = o.company_id;
        this.daterx = o.daterx;
      }
    });
  }

  ngOnInit() {
    let user = this.authService.loadUser();
    this.role = user.role;
    this.load();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  load() {
    this.authService.getUserDetails().subscribe((res: any) => {
      this.user = !_.isEmpty(res.data) ? res.data[0] : {};
      this.company_id = this.user.company_id;
      this.loadDashboard();
      this.loadCompany();
    },
    (error) => {
      this.toastr.error('Load User Details Failed');
    });
  }

  loadCompany() {
    this.companyService.listCompany(this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir).subscribe((res: any) => {
      this.list = res.status ? res.data : [];
    },
    (error) => {
      this.toastr.error('Load Company Failed');
    });
  }

  loadDashboard() {
    this.isloading = true;
    const o = {
      company_id: this.company_id,
      start_date: Helper.getDateStr(this.datex[0]),
      end_date: Helper.getDateStr(this.datex[1])
    };
    this.dashboardService.getKPI(o).subscribe((res: any) => {
      const o = res.status ? res.data.overview : [];
      let m = {
        'new': 0,
        'pending': 0,
        'delivered': 0,
        'cancel': 0
      };

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

  onDateChange(val) {
    if (_.isNull(val)) {
      return;
    }

    this.datex = val;
    if (!Helper.isEmpty(this.company_id)) {
      this.loadDashboard();
    }
  }

  onKPI(i) {
    this.msService.send('main-dashboard', {
      company_id: this.company_id,
      daterx: this.datex
    });
    this.router.navigate(['/cit/dashboard/list', i, this.company_id], { queryParams: { s_date: Helper.getDateStr(this.datex[0]), e_date: Helper.getDateStr(this.datex[1]) } });
    return false;
  }

  onViewDetails(o) {
    this.msService.send('main-dashboard', {
      company_id: this.company_id,
      daterx: this.datex
    });
    this.router.navigate(['/cit/company/edit', o.company_id]);
    return false;
  }

  onViewDashboard(o) {
    this.company_id = o.company_id;
    this.loadDashboard();
    return false;
  }
}
