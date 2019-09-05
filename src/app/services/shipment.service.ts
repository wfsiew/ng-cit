import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import _ from 'lodash';
import { Helper } from '../shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  listShipment(page, limit, sort, dir, value) {
    let i = Helper.getStart(page, limit);
    let prm: HttpParams = new HttpParams()
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('value', value);
    return this.http.get(`${this.baseUrl}/api/shipment/list/`, { params: prm });
  }

  getShipment(id) {
    return this.http.get(`${this.baseUrl}/api/shipmentOrder/${id}`);
  }
}
