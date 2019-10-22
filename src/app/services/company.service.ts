import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createCompany(o) {
    return this.http.post(`${this.baseUrl}/api/company/create`, o);
  }

  listCompany(admin: boolean = false) {
    if (admin === true) {
      let prm = new HttpParams().set('admin', '1');
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

  listUser(pending: boolean = false) {
    if (pending === true) {
      let prm = new HttpParams().set('pending', '1');
      return this.http.get(`${this.baseUrl}/api/company/user/list`, { params: prm });
    }
    
    return this.http.get(`${this.baseUrl}/api/company/user/list`);
  }

  assignUser(o) {
    return this.http.post(`${this.baseUrl}/api/company/user/new`, o);
  }
}
