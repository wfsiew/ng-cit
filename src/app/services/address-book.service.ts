import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import _ from 'lodash';
import { Helper } from 'src/app/shared/utils/helper';

@Injectable({
  providedIn: 'root'
})
export class AddressBookService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createAddressBook(o) {
    return this.http.post(`${this.baseUrl}/api/address/create`, o);
  }

  listAddressBook(page, limit, sort, dir, value, is_private: boolean = false) {
    let i = Helper.getStart(page, limit);
    let prm: HttpParams = new HttpParams()
      .set('start', `${i}`)
      .set('length', limit)
      .set('order', sort)
      .set('dir', dir)
      .set('value', value)
      .set('private', is_private === true ? '1' : '0');
    return this.http.get(`${this.baseUrl}/api/address/list`, { params: prm });
  }

  getAddressBook(id) {
    let prm: HttpParams = new HttpParams()
      .set('address_id', id);
    return this.http.get(`${this.baseUrl}/api/address/list`, { params: prm });
  }

  deleteAddressBook(lx: string[]) {
    let ls = _.map(lx, (x) => {
      return { id: x };
    });
    return this.http.post(`${this.baseUrl}/api/address/delete`, ls);
  }

  updateAddressBook(o) {
    return this.http.put(`${this.baseUrl}/api/address/update`, o);
  }
}
