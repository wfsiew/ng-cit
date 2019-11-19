import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-print-shipment-modal',
  templateUrl: './print-shipment-modal.component.html',
  styleUrls: ['./print-shipment-modal.component.css']
})
export class PrintShipmentModalComponent implements OnInit {

  pdfsrc: string;
  pdfblob: any;
  filename: string;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  onDownload() {
    FileSaver.saveAs(this.pdfblob, this.filename);
  }
}
