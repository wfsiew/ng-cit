import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  createUser(o) {
    return this.http.post(`${this.baseUrl}/api/user/create`, o);
  }

  updateUser(o) {
    return this.http.put(`${this.baseUrl}/api/user/update`, o);
  }

  changePwd(o) {
    return this.http.put(`${this.baseUrl}/api/user/change-password`, o);
  }
}
