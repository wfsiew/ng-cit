import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShipmentService } from '../../../services/shipment.service';
import { CompanyService } from '../../../services/company.service';
import { AppConstant } from '../../../shared/constants/app.constant';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Helper } from '../../../shared/utils/helper';

@Component({
  selector: 'app-detail-shipment',
  templateUrl: './detail-shipment.component.html',
  styleUrls: ['./detail-shipment.component.css']
})
export class DetailShipmentComponent implements OnInit {

  isloading = false;
  data: any;
  id: string;

  constructor(
    private shipmentService: ShipmentService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private loc: Location
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.load();
    });
  }

  load() {
    
  }

  onBack() {
    this.loc.back();
  }
}
