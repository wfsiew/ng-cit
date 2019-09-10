import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ManifestService } from '../../../services/manifest.service';
import { CompanyService } from '../../../services/company.service';
import { MessageService } from '../../../services/message.service';
import { AppConstant } from '../../../shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';

@Component({
  selector: 'app-list-manifest',
  templateUrl: './list-manifest.component.html',
  styleUrls: ['./list-manifest.component.css']
})
export class ListManifestComponent implements OnInit {

  isloading = false;
  list = [];
  manifest_no = '';
  s_date: Date;
  e_date: Date;
  company = {
    company_id: ''
  };

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private router: Router,
    private manifestService: ManifestService,
    private companyService: CompanyService,
    private msService: MessageService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadCompanyProfile();
  }

  loadCompanyProfile() {
    this.companyService.getCompanyDetails().subscribe((res: any) => {
      this.company = !_.isEmpty(res.data) ? res.data[0] : {};
    },
    (error) => {
      this.toastr.error('Load Company Detail Failed', 'Company Detail');
    });
  }

  load() {
    let q: Observable<Object>;
    if (!Helper.isEmpty(this.manifest_no)) {
      q = this.manifestService.listManifestByNo(this.company.company_id, this.manifest_no);
    }

    else if (!_.isNull(this.s_date) && !_.isUndefined(this.s_date) 
      && !_.isNull(this.e_date) && !_.isUndefined(this.e_date)) {
      q = this.manifestService.listManifestByDateRange(this.company.company_id, this.s_date, this.e_date);
    }

    if (_.isUndefined(q) || _.isNull(q)) {
      return;
    }

    this.isloading = true;
    q.subscribe((res: any) => {
      this.list = res.status ? res.data : [];
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      if (error.status === 400) {
        this.list = [];
      }
      
      this.toastr.error('Load Manifest Failed');
    });
  }

  onSubmit() {
    this.load();
  }

  onConfirmManifest(consignment, manifest) {
    const o = {
      manifest_id: manifest.manifest_id,
      'list-cons': [
        {
          consignment: consignment.consignment,
          is_conifrm: true
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
}
