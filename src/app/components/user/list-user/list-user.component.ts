import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/utils/helper';
import { User } from 'src/app/shared/models/user';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  itemsCount = 0;
  pending = false;
  active = true;
  tab = 0;
  page = 1;
  search = '';
  sort = 'create_date';
  sort_dir = 'desc';
  isCardView = false;
  subs: Subscription;
  bsModalRef: BsModalRef;
  company_id: string;
  company_name: string;
  canEdit = false;
  user: User;
  onSearchDbKeyup: any;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;
  readonly MAX_PAGE_NUMBERS = AppConstant.MAX_PAGE_NUMBERS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private authService: AuthService,
    private msService: MessageService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.onSearchDbKeyup = _.debounce(this.onSearchKeyup, 400);
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'list-user') {
        const o = res.data;
        this.page = o.page;
        // this.sort = o.sort;
        // this.sort_dir = o.dir;
        this.search = o.search;
        this.isCardView = o.isCardView;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.company_id = params['company_id'];
      this.loadUser();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadUser() {
    this.user = this.authService.loadUser();
    this.canEdit = this.user.role === AppConstant.ROLE.ADMIN || this.user.role === AppConstant.ROLE.SUPERUSER;
    this.load();
  }

  load() {
    this.isloading = true;
    this.companyService.listUser(this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.company_id, 
      this.pending, this.active, this.search).subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      //this.itemsCount = res.status ? res.recordsTotal : 0;
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      if (error.status === 400) {
        this.list = [];
        this.itemsCount = 0;
      }

      else {
        this.toastr.error('Load User Failed');
      }
    });

    this.companyService.getCompany(this.company_id).subscribe((res: any) => {
      const data = res.status ? res.data[0] : [];
      this.company_name = data.company_name;
    },
    (errpr) => {
      this.toastr.error('Load Company Name Failed');
    });
  }

  onCreateNew() {
    const state = {
      title: 'Add User',
      company_id: this.company_id,
      canEdit: this.canEdit
    };
    this.bsModalRef = this.modalService.show(CreateUserModalComponent, { initialState: state });
    this.bsModalRef.content.onClose.subscribe(res => {
      if (res.result === true) {
        if (this.tab === 1) {
          this.load();
        }
      }
    });
  }

  onTab(i) {
    this.tab = i;
    this.pending = i === 1 ? true : false;
    this.active = i === 0 ? true : false;

    this.load();
    return false;
  }

  onView(o) {
    const x = o['list-user'];
    const state = {
      title: 'Edit User',
      user_id: x.user_id,
      company_id: this.company_id,
      invitation_id: x.invitation_id,
      email: x.Email,
      roles: x.Roles,
      canEdit: this.canEdit,
      type: this.tab
    };
    this.bsModalRef = this.modalService.show(CreateUserModalComponent, { initialState: state });
    this.bsModalRef.content.onClose.subscribe(res => {
      if (res.result === true) {
        this.load();
      }
    });
    return false;
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.load();
  }

  onSearch() {
    this.page = 1;
    this.load();
  }

  onSearchKeyup(event) {
    this.onSearch();
  }

  onSearchKeypress(event) {
    this.onSearch();
  }
}
