import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-dashboard.component.html',
  styleUrls: ['./list-dashboard.component.css']
})
export class ListDashboardComponent implements OnInit {

  isloading = false;
  list = [];
  search = '';
  id: string;
  title = '';
  daterx = [new Date(), new Date()];

  TITLE = ['NEW', 'PENDING', 'DELIVERED', 'CANCEL'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loc: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!_.isNull(this.id)) {
        this.title = this.TITLE[Number(this.id)];
      }

      this.load();
    });
  }

  load() {
    
  }

  onSearch() {
    
  }

  onView() {
    this.router.navigate(['/cit/dashboard/detail']);
    return false;
  }

  onBack() {
    this.loc.back();
  }
}
