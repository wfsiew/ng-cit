import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class RetailInboundService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getRetailInbound(num) {
    let prm: HttpParams = new HttpParams()
      .set('num', num);
    return this.http.get(`${this.baseUrl}/api/retail-inbound`, { params: prm });
  }

  createRetailInboundShipment(o) {
    return this.http.post(`${this.baseUrl}/api/retail-inbound/shipment/create`, o);
  }

  getRetailInboundShipment(id) {
    return this.http.get(`${this.baseUrl}/api/retail-inbound/shipment/edit/${id}`);
  }

  updateRetailInboundShipment(o) {
    return this.http.put(`${this.baseUrl}/api/retail-inbound/shipment/edit/${o.id}`, o);
  }

  removeRetailInboundShipment(id) {
    const o = { id: id };
    return this.http.post(`${this.baseUrl}/api/retail-inbound/shipment/remove`, o);
  }

  getQuotations(o) {
    return this.http.post(`${this.baseUrl}/api/quotations/list`, o);
  }

  confirmRetailInboundShipment(o) {
    return this.http.post(`${this.baseUrl}/api/retail-inbound/shipment/confirm`, o);
  }

  confirmPayment(o) {
    return this.http.post(`${this.baseUrl}/api/retail-inbound/confirm-payment`, o);
  }

  cashPayment(o) {
    return this.http.post(`${this.baseUrl}/api/retail-inbound/cash-payment`, o);
  }

  getCharges(o) {
    return this.http.post(`${this.baseUrl}/api/retail-inbound/shipment/charges`, o);
  }
}
