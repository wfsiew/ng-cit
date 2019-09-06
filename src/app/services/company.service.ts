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
