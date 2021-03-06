import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;
  private tokenUrl = `${this.baseUrl}/api/user/login`;
  private logoutUrl = `${this.baseUrl}/api/user/logout`;
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

  logout() {
    return this.http.post(this.logoutUrl, {});
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

  clear() {
    localStorage.clear();
  }

  extractToken(res: any): string {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
    this.token = res.token;
    const o = Object.assign(new User(), res);
    return this.token;
  }

  getUserDetails() {
    return this.http.get(`${this.baseUrl}/api/user/details`);
  }

  loadUser(): User {
    const o = localStorage.getItem('user');
    let user = null;
    if (!_.isNull(o)) {
      user = JSON.parse(o);
    }

    return user;
  }

  resetPasswordEmail(email) {
    return this.http.post(`${this.baseUrl}/api/user/password-reset/`, { email: email });
  }

  resetPassword(o) {
    return this.http.post(`${this.baseUrl}/api/user/reset-password`, o);
  }
}