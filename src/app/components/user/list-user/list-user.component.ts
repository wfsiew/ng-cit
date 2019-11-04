import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/utils/helper';
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
  tab = 0;
  page = 1;
  search = '';
  sort = '';
  sort_dir = '';
  subs: Subscription;
  bsModalRef: BsModalRef;
  company_id: string;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private msService: MessageService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'list-user') {
        const o = res.data;
        this.page = o.page;
        // this.sort = o.sort;
        // this.sort_dir = o.dir;
        this.search = o.search;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.company_id = params['company_id'];
      this.load();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  load() {
    this.isloading = true;
    this.companyService.listUser(this.pending).subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      console.log(this.list)
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
      console.log(res);
    },
    (error) => {
      this.toastr.error('Load Company Name Failed');
    });
  }

  onCreateNew() {
    const state = {
      title: 'Add User',
      company_id: this.company_id
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
    this.pending = i === 0 ? false : true;
    this.load();
    return false;
  }

  onView(o) {
    const x = o['list-user'];
    const state = {
      title: 'Edit User',
      email: x.Email,
      roles: x.Roles
    };
    this.bsModalRef = this.modalService.show(CreateUserModalComponent, { initialState: state });
    this.bsModalRef.content.onClose.subscribe(res => {
      if (res.result === true) {
        if (this.tab === 1) {
          this.load();
        }
      }
    });
    return false;
  }

  onSearch() {
    this.load();
  }

  onSearchKeypress(event) {
    this.load();
  }
}
