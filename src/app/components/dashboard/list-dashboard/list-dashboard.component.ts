import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { CompanyService } from '../../../services/company.service';
import { Location } from '@angular/common';
import { MessageService } from '../../../services/message.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-dashboard.component.html',
  styleUrls: ['./list-dashboard.component.css']
})
export class ListDashboardComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  search = '';
  id: string;
  company_id: string;
  company_name = '';
  title = '';
  daterx = [new Date(), new Date()];

  TITLE = ['NEW', 'PENDING', 'DELIVERED', 'CANCEL'];
  STATUS = ['new', 'pending', 'delivered', 'cancel'];

  readonly isEmpty = Helper.isEmpty;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location,
    private dashboardService: DashboardService,
    private companyService: CompanyService,
    private msService: MessageService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!_.isNull(this.id)) {
        this.title = this.TITLE[Number(this.id)];
      }

      this.company_id = params.get('company_id');

      this.load();
    });
  }

  ngOnDestroy() {

  }

  load() {
    this.companyService.getCompany(this.company_id).subscribe((res: any) => {
      this.company_name = res.status ? res.data[0].display_name : '';
    });
    this.loadList();
  }

  loadList() {
    this.isloading = true;
    const o = {
      company_id: this.company_id,
      start_date: Helper.getDateStr(this.daterx[0]),
      end_date: Helper.getDateStr(this.daterx[1]),
      status: this.STATUS[Number(this.id)]
    }
    this.dashboardService.listShipment(o).subscribe((res: any) => {
      this.list = res.status ? res.data.list : [];
      this.isloading = false;
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load Shipment Failed');
    });
  }

  onDateChange() {
    this.loadList();
  }

  onSearch() {
    this.loadList();
  }

  onView() {
    this.router.navigate(['/cit/dashboard/detail']);
    return false;
  }

  onBack() {
    this.loc.back();
  }
}
