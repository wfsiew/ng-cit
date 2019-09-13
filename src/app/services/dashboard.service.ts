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

  getKPI(company_id: string) {
    const o = {
      company_id: '11b91530-b4e8-4b47-b3d3-e6d4e31077a9'
    };
    let prm = new HttpParams().set('company_id', company_id);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: prm
    };
    
    return this.http.get(`${this.baseUrl}/api/dashboard/company/kpi/`, httpOptions);
  }
}
