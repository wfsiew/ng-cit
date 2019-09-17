import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Helper } from '../shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getKPI(o) {
    return this.http.post(`${this.baseUrl}/api/dashboard/company/kpi/`, o);
  }

  listShipment(o) {
    return this.http.post(`${this.baseUrl}/api/dashboard/shipment/list`, o);
  }

  getShipmentDetailByConsignment(consignment_no) {
    return this.http.get(`${this.baseUrl}/api/dashboard/shipment/list/${consignment_no}`);
  }
}
