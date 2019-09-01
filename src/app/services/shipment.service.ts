import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  listShipment() {
    return this.http.get(`${this.baseUrl}/api/shipmentOrderViewSet/`);
  }

  getShipment(id) {
    return this.http.get(`${this.baseUrl}/api/shipmentOrder/${id}`);
  }
}
