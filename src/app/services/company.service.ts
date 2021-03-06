import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createCompany(o) {
    return this.http.post(`${this.baseUrl}/api/company/create`, o);
  }

  listCompany__(admin: boolean = false) {
    if (admin === true) {
      let prm = new HttpParams().set('admin', '1');
      return this.http.get(`${this.baseUrl}/api/company/list`, { params: prm });
    }
    
    return this.http.get(`${this.baseUrl}/api/company/list`);
  }

  listCompany(page, limit, sort, dir, value = '') {
    let i = Helper.getStart(page, limit);
    let prm: HttpParams = new HttpParams()
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('value', value)
    return this.http.get(`${this.baseUrl}/api/company/list`, { params: prm });
  }

  getCompany(id) {
    let prm: HttpParams = new HttpParams()
      .set('id', id);
    return this.http.get(`${this.baseUrl}/api/company/details`, { params: prm });
  }

  getCompanyDetails() {
    return this.http.get(`${this.baseUrl}/api/company/details`);
  }

  addCompanyService(o) {
    return this.http.post(`${this.baseUrl}/api/company/add_service`, o);
  }

  updateCompany(o) {
    return this.http.put(`${this.baseUrl}/api/company/update`, o);
  }

  listUser(page, limit, sort, dir, company_id, pending: boolean = false, active = false, value = '') {
    let i = Helper.getStart(page, limit);
    if (pending === true) {
      let prm = new HttpParams()
        .set('start', `${i}`)
        .set('length', limit)
        .set('order', sort)
        .set('dir', dir)
        .set('pending', '1')
        .set('company_id', company_id)
        .set('value', value);
      return this.http.get(`${this.baseUrl}/api/company/user/list`, { params: prm });
    }

    if (active === true) {
      let prm = new HttpParams()
        .set('start', `${i}`)
        .set('length', limit)
        .set('order', sort)
        .set('dir', dir)
        .set('active', '1')
        .set('company_id', company_id)
        .set('value', value);
      return this.http.get(`${this.baseUrl}/api/company/user/list`, { params: prm });
    }
    
    let prm = new HttpParams()
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('active', '0')
      .set('company_id', company_id)
      .set('value', value);
    return this.http.get(`${this.baseUrl}/api/company/user/list`, { params: prm });
  }

  assignUser(o) {
    return this.http.post(`${this.baseUrl}/api/company/user/new`, o);
  }
}
