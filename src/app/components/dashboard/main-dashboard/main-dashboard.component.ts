import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  search = '';
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
  onSearchDbKeyup: any;
  company_id: string;
  company_name: string;
  role: string;
  daterx = [new Date(), new Date()];
  datex = this.daterx;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;
  readonly MAX_PAGE_NUMBERS = AppConstant.MAX_PAGE_NUMBERS;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private companyService: CompanyService,
    private authService: AuthService,
    private msService: MessageService,
    private toastr: ToastrService
  ) {
    this.onSearchDbKeyup = _.debounce(this.onSearchKeyup, 400);
  }

  ngOnInit() {
    let user = this.authService.loadUser();
    this.role = user.role;
    const s = localStorage.getItem('main-dashboard');
    if (!_.isNull(s)) {
      const o = JSON.parse(s);
      this.company_id = o.company_id;
      this.company_name = o.company_name;
      this.daterx = [new Date(o.daterx[0]), new Date(o.daterx[1])];
      this.search = _.isNull(o.search) || _.isUndefined(o.search) ? '' : o.search;
      localStorage.removeItem('main-dashboard');
    }

    this.load();
  }

  ngOnDestroy() {

  }

  load() {
    this.authService.getUserDetails().subscribe((res: any) => {
      this.user = !_.isEmpty(res.data) ? res.data[0] : {};
      if (Helper.isEmpty(this.company_id)) {
        this.company_id = this.user.company_id;
        this.company_name = this.user.company_name;
      }
      
      this.loadDashboard();
      this.loadCompany();
    },
    (error) => {
      this.toastr.error('Load User Details Failed');
    });
  }

  loadCompany() {
    this.companyService.listCompany(this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search).subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      this.itemsCount = res.status ? res.recordsTotal : 0;
    },
    (error) => {
      if (error.status === 400) {
        this.list = [];
        this.itemsCount = 0;
      }

      else {
        this.toastr.error('Load Company Failed');
      }
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
    localStorage.removeItem('list-dashboard');
    localStorage.setItem('main-dashboard', JSON.stringify({
      company_id: this.company_id,
      company_name: this.company_name,
      daterx: this.datex,
      search: this.search
    }));
    this.router.navigate(['/cit/dashboard/list', i, this.company_id], { queryParams: { s_date: Helper.getDateStr(this.datex[0]), e_date: Helper.getDateStr(this.datex[1]) } });
    return false;
  }

  onViewDetails(o) {
    localStorage.setItem('main-dashboard', JSON.stringify({
      company_id: this.company_id,
      company_name: this.company_name,
      daterx: this.datex,
      search: this.search
    }));
    this.router.navigate(['/cit/company/edit', o.company_id]);
    return false;
  }

  onViewDashboard(o) {
    this.company_id = o.company_id;
    this.company_name = o.company_name;
    this.loadDashboard();
    return false;
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.loadCompany();
  }

  onSearch() {
    this.page = 1;
    this.loadCompany();
  }

  onSearchKeyup(event) {
    this.onSearch();
  }

  onSearchKeypress(event) {
    this.onSearch();
  }
}
