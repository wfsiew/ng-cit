import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManifestService } from '../../../services/manifest.service';
import { Location } from '@angular/common';
import { AppConstant } from '../../../shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-detail-manifest',
  templateUrl: './detail-manifest.component.html',
  styleUrls: ['./detail-manifest.component.css']
})
export class DetailManifestComponent implements OnInit {

  isloading = false;
  list = [];
  manifest_no: string;
  company_id: string;
  data: any = {};
  modalRef: BsModalRef;
  itemsCount = 0;
  page = 1;
  search = '';
  sort = 'id';
  sort_dir = '';

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;
  
  constructor(
    private route: ActivatedRoute,
    private loc: Location,
    private manifestService: ManifestService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.manifest_no = params.get('manifest_no');
      this.company_id = params.get('company_id');
      this.load();
    });
  }

  load() {
    this.isloading = true;
    this.manifestService.getManifestDetail(this.company_id, this.manifest_no, this.page, AppConstant.PAGE_SIZE, this.sort, this.sort_dir, this.search).subscribe((res: any) => {
      let x = res.status ? res.data : {};
      this.data = x;
      this.itemsCount = x.total_record;
      this.list = x['list-consignment'][0];
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load Manifest Detail Failed');
    });
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.load();
  }

  onConfirmCloseManifest(tp: TemplateRef<any>) {
    this.modalRef = this.modalService.show(tp, {class: 'modal-sm'});
  }

  _onConfirmClose() {
    this.closeManifest();
  }

  closeManifest() {
    const manifest = this.data;
    const o = {
      manifest_id: manifest.manifest_id
    };
    this.manifestService.closeManifest(o, this.company_id).subscribe((res: any) => {
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

  onConfirmConsignment(consignment) {
    const manifest = this.data;
    const o = {
      manifest_id: manifest.manifest_id,
      'list-cons': [
        {
          consignment: consignment.consignment,
          is_confirm: !consignment.is_confirm
        }
      ]
    };
    this.manifestService.updateManifest(o, this.company_id).subscribe((res: any) => {
      this.load();
    },
    (error) => {
      this.toastr.error('Update Manifest Failed', 'Confirm Manifest');
    });
  }

  onCheckIn(consignment) {
    const o = {
      branch_id: null,
      company_id: this.company_id,
      'list-cons': [
        {
          consignment: consignment.consignment
        }
      ]
    };
    this.manifestService.checkinConsignment(o).subscribe((res: any) => {

    },
    (error) => {
      this.toastr.error('Check In Consignment Failed');
    });
  }

  onSearch() {
    this.load();
  }

  onSearchKeypress(event) {
    this.load();
  }

  onBack() {
    this.loc.back();
  }
}
