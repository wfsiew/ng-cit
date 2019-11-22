import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CompanyService } from 'src/app/services/company.service';
import { Location, formatDate } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';

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
  datex = this.daterx;

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
    this.route.queryParams.subscribe(params => {
      this.daterx = [new Date(params['s_date']), new Date(params['e_date'])];
    });
  }

  ngOnDestroy() {

  }

  load() {
    this.companyService.getCompany(this.company_id).subscribe((res: any) => {
      this.company_name = res.status ? res.data[0].display_name : '';
    });
  }

  loadList() {
    this.isloading = true;
    const o = {
      company_id: this.company_id,
      start_date: Helper.getDateStr(this.datex[0]),
      end_date: Helper.getDateStr(this.datex[1]),
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

  onDateChange(val) {
    if (_.isNull(val)) {
      return;
    }

    this.datex = val;
    this.loadList();
  }

  onSearch() {
    this.loadList();
  }

  onSearchKeypress(event) {
    this.loadList();
  }

  onView(o) {
    this.router.navigate(['/cit/dashboard/detail', o.ConsignmentNo]);
    return false;
  }

  onCSV() {
    const ls = this.list;
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(ls[0]);
    let csv = ls.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const lx = csv.join('\r\n');

    const blob = new Blob([lx], { type: 'text/csv' });
    const dt = formatDate(new Date(), 'yyyyMMdd-HHmmss', 'en');
    const filename = `${dt}.csv`;

    FileSaver.saveAs(blob, filename);
  }

  onExcel() {
    const ls = this.list;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ls);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const dt = formatDate(new Date(), 'yyyyMMdd-HHmmss', 'en');
    const filename = `${dt}_export_${new Date().getTime()}.xlsx`;

    FileSaver.saveAs(blob, filename);
  }

  onPrint() {
    print();
  }

  onBack() {
    this.loc.back();
  }
}
