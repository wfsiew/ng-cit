import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManifestService } from '../../../services/manifest.service';
import { Location } from '@angular/common';
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

  readonly isEmpty = Helper.isEmpty;
  
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
    this.manifestService.listManifestByNo(this.company_id, this.manifest_no, 1, 50, 'id', '', '', '1').subscribe((res: any) => {
      let x = res.status ? res.data[0] : {};
      this.data = x;
      this.list = x['list-consignment'];
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load Manifest Detail Failed');
    });
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

  onBack() {
    this.loc.back();
  }
}
