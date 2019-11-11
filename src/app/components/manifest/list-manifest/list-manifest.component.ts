import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ManifestService } from 'src/app/services/manifest.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list-manifest',
  templateUrl: './list-manifest.component.html',
  styleUrls: ['./list-manifest.component.css']
})
export class ListManifestComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  manifest_no = '';
  daterx = [new Date(), new Date()];
  datex = this.daterx;
  company = {
    company_id: ''
  };
  modalRef: BsModalRef;
  selectedManifest: any;
  itemsCount = 0;
  page = 1;
  search = '';
  sort = 'id';
  sort_dir = '';
  subs: Subscription;

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;

  constructor(
    private router: Router,
    private manifestService: ManifestService,
    private companyService: CompanyService,
    private authService: AuthService,
    private msService: MessageService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.subs = this.msService.get().subscribe(res => {
      if (res.name === 'list-manifest') {
        const o = res.data;
        this.page = o.page;
        this.sort = o.sort;
        this.sort_dir = o.dir;
        this.search = o.search;
        this.manifest_no = o.manifest_no;
        this.daterx = [o.s_date, o.e_date];
        this.datex = this.daterx;
      }
    });
  }

  ngOnInit() {
    this.loadUserDetails();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadUserDetails() {
    this.authService.getUserDetails().subscribe((res: any) => {
      let user = !_.isEmpty(res.data) ? res.data[0] : {};
      let company_id = user.company_id;
      this.loadCompanyProfile(company_id);
    },
    (error) => {
      this.toastr.error('Load User Details Failed');
    });
  }

  loadCompanyProfile(id) {
    this.companyService.getCompany(id).subscribe((res: any) => {
      this.company = !_.isEmpty(res.data) ? res.data[0] : {};
      this.load();
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed');
    });
  }

  load() {
    if (Helper.isEmpty(this.company.company_id)) {
      return;
    }

    let q = this.manifestService.listManifest(this.company.company_id, this.datex[0], this.datex[1], this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search);
    // if (!Helper.isEmpty(this.manifest_no)) {
    //   q = this.manifestService.listManifestByNo(this.company.company_id, this.manifest_no, this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search);
    // }

    // else if (!_.isNull(this.datex[0]) && !_.isUndefined(this.datex[0]) 
    //   && !_.isNull(this.datex[1]) && !_.isUndefined(this.datex[1])) {
    //   q = this.manifestService.listManifestByDateRange(this.company.company_id, this.datex[0], this.datex[1], this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search);
    // }

    // if (_.isUndefined(q) || _.isNull(q)) {
    //   return;
    // }

    this.isloading = true;
    q.subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      this.itemsCount = this.list.length;
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      if (error.status === 400) {
        this.list = [];
      }

      else {
        this.toastr.error('Load Manifest Failed');
      }
    });
  }

  onDateChange(val) {
    this.datex = val;
    this.load();
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.load();
  }

  onView(o) {
    this.msService.send('list-manifest', {
      page: this.page,
      sort: this.sort,
      dir: this.sort_dir,
      search: this.search,
      manifest_no: this.manifest_no,
      s_date: this.daterx[0],
      e_date: this.daterx[1]
    });
    this.router.navigate(['/cit/manifest/detail', o.manifest_no, this.company.company_id]);
    return false;
  }

  onSubmit() {
    this.load();
  }

  onConfirmConsignment(consignment, manifest) {
    const o = {
      manifest_id: manifest.manifest_id,
      'list-cons': [
        {
          consignment: consignment.consignment,
          is_conifrm: !consignment.is_confirm
        }
      ]
    };
    this.manifestService.updateManifest(o, this.company.company_id).subscribe((res: any) => {
      this.load();
    },
    (error) => {
      this.toastr.error('Update Manifest Failed', 'Confirm Manifest');
    });
  }

  onConfirmClose(tp: TemplateRef<any>, o) {
    this.selectedManifest = o;
    this.modalRef = this.modalService.show(tp, {class: 'modal-sm'});
  }

  _onConfirmClose() {
    this.closeManifest(this.selectedManifest);
  }

  closeManifest(manifest) {
    const o = {
      manifest_id: manifest.manifest_id
    };
    this.manifestService.closeManifest(o, this.company.company_id).subscribe((res: any) => {
      this.onCancel();
      this.load();
    },
    (error) => {
      this.toastr.error('Close Manifest Failed');
    });
  }

  onCancel() {
    this.modalRef.hide();
  }

  onSearch() {
    this.load();
  }

  onSearchKeypress(event) {
    this.load();
  }
}
