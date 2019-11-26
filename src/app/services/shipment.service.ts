import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createShipment(o) {
    return this.http.post(`${this.baseUrl}/api/shipment/create`, o);
  }

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
    let prm: HttpParams = new HttpParams()
      .set('shipment_id', `${id}`);
    return this.http.get(`${this.baseUrl}/api/shipment/list/`, { params: prm });
  }

  updateShipment(o) {
    return this.http.put(`${this.baseUrl}/api/shipment/update`, o);
  }

  uploadShipment(o: FormData) {
    return this.http.post(`${this.baseUrl}/file/confirm_upload/`, o, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;

        default:
          return `Unhandled event: ${event.type}`;
      }
    }));
  }

  printLabel(consignment_no: string, type: string) {
    let prm: HttpParams = new HttpParams()
      .set('consignment_no', consignment_no);
    return this.http.get(`${this.baseUrl}/api/reports/labels/`, { params: prm, responseType: 'blob' });
  }
}