import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CompanyService } from 'src/app/services/company.service';
import { Location, formatDate } from '@angular/common';
import { MessageService } from 'src/app/services/message.service';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/shared/utils/helper';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-dashboard.component.html',
  styleUrls: ['./list-dashboard.component.css']
})
export class ListDashboardComponent implements OnInit, OnDestroy {

  isloading = false;
  list = [];
  slist = [];
  itemsCount = 0;
  page = 1;
  search = '';
  id: string;
  company_id: string;
  company_name = '';
  title = '';
  daterx = [new Date(), new Date()];
  datex = this.daterx;
  sx = 0;
  sy = 0;

  TITLE = ['NEW', 'PENDING', 'DELIVERED', 'CANCEL'];
  STATUS = ['new', 'pending', 'delivered', 'cancel'];

  readonly isEmpty = Helper.isEmpty;
  readonly PAGE_SIZE = AppConstant.PAGE_SIZE;
  readonly MAX_PAGE_NUMBERS = AppConstant.MAX_PAGE_NUMBERS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location,
    private dashboardService: DashboardService,
    private companyService: CompanyService,
    private msService: MessageService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!_.isNull(this.id)) {
        this.title = this.TITLE[Number(this.id)];
      }

      this.company_id = params.get('company_id');
      const s = localStorage.getItem('list-dashboard');
      if (!_.isNull(s)) {
        const o = JSON.parse(s);
        this.page = o.page;
        this.sx = o.sx;
        this.sy = o.sy;
        this.list = o.list;
        localStorage.removeItem('list-dashboard');
      }
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
    if (!_.isEmpty(this.list)) {
      this.itemsCount = this.list.length;
      this.setList();
      setTimeout(() => {
        window.scrollTo(this.sx, this.sy);
      }, 200);
      return;
    }

    this.isloading = true;
    const o = {
      company_id: this.company_id,
      start_date: Helper.getDateStr(this.datex[0]),
      end_date: Helper.getDateStr(this.datex[1]),
      status: this.STATUS[Number(this.id)]
    }
    this.dashboardService.listShipment(o).subscribe((res: any) => {
      this.list = res.status ? res.data.list : [];
      this.itemsCount = this.list.length;
      this.setList();
      this.isloading = false;
      setTimeout(() => {
        window.scrollTo(this.sx, this.sy);
      }, 200);
    },
    (error) => {
      this.isloading = false;
      this.toastr.error('Load Shipment Failed');
    });
  }

  setList() {
    let a = (this.page - 1) * this.PAGE_SIZE;
    let b = a + this.PAGE_SIZE;

    if (b > this.itemsCount) {
      b = this.itemsCount;
    }
    
    let lx = [];
    for (let i = a; i < b; i++) {
      lx.push(this.list[i]);
    }

    this.slist = lx;
  }

  onDateChange(val) {
    if (_.isNull(val)) {
      return;
    }

    this.datex = val;
    this.loadList();
  }

  pageChanged(event: any) {
    this.page = event.page;
    this.setList();
  }

  onSearch() {
    this.list = [];
    this.loadList();
  }

  onSearchKeypress(event) {
    this.onSearch();
  }

  onView(o) {
    localStorage.setItem('list-dashboard', JSON.stringify({
      page: this.page,
      sx: window.scrollX,
      sy: window.scrollY,
      list: this.list
    }));
    this.router.navigate(['/cit/dashboard/detail', o.ConsignmentNo]);
    return false;
  }

  onCSV() {
    const ls = this.removeFields();
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
    const ls = this.removeFields();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ls);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const dt = formatDate(new Date(), 'yyyyMMdd-HHmmss', 'en');
    const filename = `${dt}_export_${new Date().getTime()}.xlsx`;

    FileSaver.saveAs(blob, filename);
  }

  removeFields() {
    let ls = ['Customer_ref2', 'cn_AddressId', 'isExt', 'pod_url', 'shipper_AddressId', 'taskId', 'taskname'];
    let lx = [];
    for (let o of this.list) {
      let x = o;
      for (let s of ls) {
        delete x[s]
      }

      lx.push(x);
    }
    return lx;
  }

  onPrint() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var dd = {
      pageSize: 'A4',
      pageMargins: [30, 40, 30, 40],
      content: [
        {
          text: `${this.title}\t${this.company_name}`,
          style: 'hd'
        },
        {
          text: `${Helper.getDateStr(this.daterx[0])} - ${Helper.getDateStr(this.daterx[1])}`,
          style: 'hdr'
        },
        {
          style: 'tbl',
          table: {
            headerRows: 1,
            body: this.getData()
          }
        }
      ],
      styles: {
        hd: {
          fontSize: 12,
          bold: true,
          margin: [5, 0, 0, 0]
        },
        hdr: {
          fontSize: 9,
          bold: true,
          margin: [0, 0, 5, 0],
          alignment: 'right',
        },
        tbl: {
          margin: [5, 5, 5, 5]
        },
        tblHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
        tblText: {
          fontSize: 10
        }
      }
    }

    pdfMake.createPdf(dd).open();
  }

  getData() {
    const ls = this.list;
    let lk = [
      [{ text: 'Consignment', style: 'tblHeader' }, 
      { text: 'Customer Ref', style: 'tblHeader' }, 
      { text: 'Shipper Name', style: 'tblHeader' }, 
      { text: 'Receiver Name', style: 'tblHeader' },
      { text: 'Receiver HP', style: 'tblHeader' }, 
      { text: 'Weight', style: 'tblHeader' }, 
      { text: 'Status', style: 'tblHeader' }]
    ];
    for (let o of ls) {
      let lx = [
        { text: o.ConsignmentNo, style: 'tblText' },
        { text: o.Customer_ref1, style: 'tblText' },
        { text: o.shipper_name, style: 'tblText' },
        { text: o.cn_name, style: 'tblText' },
        { text: o.cn_TelNo, style: 'tblText' },
        { text: o.weight, style: 'tblText' },
        { text: o.status.toUpperCase(), style: 'tblText' }
      ];
      lk.push(lx);
    }

    return lk;
  }

  onBack() {
    this.loc.back();
  }
}
