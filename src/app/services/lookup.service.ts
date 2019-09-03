import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  listCountryInfo() {
    return this.http.get(`${this.baseUrl}/api/lookup/country-info`);
  }

  listService() {
    return this.http.get(`${this.baseUrl}/api/lookup/generic_master?master_type=service`);
  }

  listUOM() {
    return this.http.get(`${this.baseUrl}/api/lookup/generic_master?master_type=uom`);
  }
}
