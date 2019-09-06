import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Helper } from '../shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  listManifestByNo(company_id: string, manifest_no: string) {
    let prm: HttpParams = new HttpParams()
      .set('manifestno', 'FMFM20190904001')
      .set('details', '1');
    return this.http.get(`${this.baseUrl}/api/manifest/03068911-4055-416c-87f1-c439967f8bc4/list/`, { params: prm });
  }

  listManifestByDateRange(company_id: string, start: Date, end: Date) {
    let prm: HttpParams = new HttpParams()
      .set('start_date', Helper.getDateStr1(start))
      .set('end_date', Helper.getDateStr1(end))
      .set('details', '1');
    return this.http.get(`${this.baseUrl}/api/manifest/${company_id}/list/`, { params: prm });
  }
}
