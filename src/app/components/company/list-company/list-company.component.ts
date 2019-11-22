import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app//services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/models/user';
import { Helper } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.css']
})
export class ListCompanyComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  itemsCount = 0;
  page = 1;
  search = '';
  sort = 'company_account_code';
  sort_dir = 'desc';
  user: User;
  onSearchDbKeyup: any;
  subs: Subscription;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;
  readonly MAX_PAGE_NUMBERS = AppConstant.MAX_PAGE_NUMBERS;
  readonly ROLE = AppConstant.ROLE;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private authService: AuthService,
    private msService: MessageService,
    private toastr: ToastrService
  ) {
    this.onSearchDbKeyup = _.debounce(this.onSearchKeyup, 400);
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'list-company') {
        const o = res.data;
        this.page = o.page;
        // this.sort = o.sort;
        // this.sort_dir = o.dir;
        this.search = o.search;
      }
    });
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  load() {
    this.isloading = true;
    this.user = this.authService.loadUser();
    this.companyService.listCompany(this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search).subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      this.itemsCount = res.status ? res.recordsTotal : 0;
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      if (error.status === 400) {
        this.list = [];
        this.itemsCount = 0;
      }

      else {
        this.toastr.error('Load Company Failed');
      }
    });
  }

  onCreateNew() {
    this.router.navigate(['/cit/company/create']);
  }

  onViewDetails(o) {
    this.router.navigate(['/cit/company/edit', o.company_id]);
    return false;
  }

  onViewUser(o) {
    this.router.navigate(['/cit/company/user/list'], { queryParams: { company_id: o.company_id } });
    return false;
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.load();
  }

  onSearch() {
    this.load();
  }

  onSearchKeyup(event) {
    this.onSearch();
  }

  onSearchKeypress(event) {
    this.load();
  }
}
