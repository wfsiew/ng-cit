import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AddressBookService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createAddressBook(o) {
    return this.http.post(`${this.baseUrl}/api/address/create`, o);
  }

  listAddressBook() {
    return this.http.get(`${this.baseUrl}/api/address/list`);
  }

  deleteAddressBook(lx: string[]) {
    let ls = _.map(lx, (x) => {
      return { id: x };
    });
    return this.http.post(`${this.baseUrl}/api/address/delete`, ls);
  }
}
