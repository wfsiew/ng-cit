import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { User, UserDetail } from '../models/user';
import { environment } from '../../environments/environment';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;
  private tokenUrl = `${this.baseUrl}/api/user/login`;
  private userDetailsUrl = `${this.baseUrl}/api/user/details`;
  private token: string;

  constructor(private http: HttpClient) { }

  getToken(): string {
    return localStorage.getItem('token');
  }

  authenticate(username: string, password: string): Observable<string> {
    return this.http.post(this.tokenUrl, {
      username: username,
      password: password
    }).pipe(
      map(res => this.extractToken(res)),
      catchError(e => this.handleError(e))
    );
  }

  logoff() {

  }

  handleError(e): string {
    if (e.status && (e.status == 401 || e.status == 403)) {
      return;
    }

    throw ('invalid_grant');
  }

  hasValidToken(): boolean {
    return !!this.getToken();
  }

  clear(): void {
    this.logoff();
    localStorage.clear();
  }

  extractToken(res: any): string {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
    this.token = res.token;
    const o = Object.assign(new User(), res);
    return this.token;
  }

  getUserDetails(): Observable<UserDetail[]> {
    return this.http.get(this.userDetailsUrl).pipe(
      map((res: any) => {
        const o = res.data;
        localStorage.setItem('user-detail', JSON.stringify(o));
        let lx: UserDetail[] = [];
        _.each(o, (x) => {
          let k: UserDetail = Object.assign(new UserDetail(), x);
          lx.push(k);
        });
        return lx;
      })
    );
  }

  loadUser(): User {
    const o = localStorage.getItem('user');
    let user = null;
    if (!_.isNull(o)) {
      user = JSON.parse(o);
    }

    return user;
  }

  loadUserDetails() {
    const o = localStorage.getItem('user-detail');
    let x = null;
    if (!_.isNull(o)) {
      x = JSON.parse(o);
    }

    return x;
  }
}