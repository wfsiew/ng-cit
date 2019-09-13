import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  listCompany(admin: boolean = false) {
    let prm = new HttpParams().set('admin', '1');
    if (admin === true) {
      return this.http.get(`${this.baseUrl}/api/company/list`, { params: prm });
    }
    
    return this.http.get(`${this.baseUrl}/api/company/list`);
  }

  getCompany(id) {
    let prm: HttpParams = new HttpParams()
      .set('id', id);
    return this.http.get(`${this.baseUrl}/api/company/details`, { params: prm });
  }

  getCompanyDetails() {
    return this.http.get(`${this.baseUrl}/api/company/details`);
  }

  addCompanyAndService(o) {
    return this.http.post(`${this.baseUrl}/api/company/add_service`, o);
  }

  updateCompanyAndService(o) {
    return this.http.post(`${this.baseUrl}/api/company/update`, o);
  }
}
