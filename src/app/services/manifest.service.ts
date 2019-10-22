import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  listManifest(company_id: string, start: Date, end: Date, page, limit, sort, dir, value) {
    let i = Helper.getStart(page, limit);
    let prm: HttpParams = new HttpParams()
      .set('start_date', Helper.getDateStr1(start))
      .set('end_date', Helper.getDateStr1(end))
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('value', value);
    return this.http.get(`${this.baseUrl}/api/manifest/${company_id}/list/`, { params: prm });
  }

  getManifestDetail(company_id: string, manifest_no: string, page, limit, sort, dir, value) {
    let i = Helper.getStart(page, limit);
    let prm: HttpParams = new HttpParams()
      .set('manifestno', manifest_no)
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('value', value);
    return this.http.get(`${this.baseUrl}/api/manifest/${company_id}/list/`, { params: prm });
  }

  listManifestByNo(company_id: string, manifest_no: string, page, limit, sort, dir, value, details: string = '0') {
    let i = Helper.getStart(page, limit);
    let prm: HttpParams = new HttpParams()
      .set('manifestno', manifest_no)
      .set('details', details)
      .set('details_status', 'all')
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('value', value);
    return this.http.get(`${this.baseUrl}/api/manifest/${company_id}/list/`, { params: prm });
  }

  listManifestByDateRange(company_id: string, start: Date, end: Date, page, limit, sort, dir, value, details: string = '0') {
    let i = Helper.getStart(page, limit);
    let prm: HttpParams = new HttpParams()
      .set('start_date', Helper.getDateStr1(start))
      .set('end_date', Helper.getDateStr1(end))
      .set('details', details)
      .set('details_status', 'all')
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('value', value);
    return this.http.get(`${this.baseUrl}/api/manifest/${company_id}/list/`, { params: prm });
  }

  closeManifest(o, company_id: string) {
    return this.http.post(`${this.baseUrl}/api/manifest/${company_id}/update/close`, o);
  }

  updateManifest(o, company_id: string) {
    return this.http.post(`${this.baseUrl}/api/manifest/${company_id}/update/`, o);
  }

  checkinConsignment(o) {
    return this.http.post(`${this.baseUrl}/api/checkin/consignment`, o);
  }
}
