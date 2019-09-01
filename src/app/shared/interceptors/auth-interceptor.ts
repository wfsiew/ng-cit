
import { empty as observableEmpty, throwError as observableThrowError, Observable, BehaviorSubject, TimeoutError } from 'rxjs';

import { take, filter, catchError, switchMap, finalize, timeout } from 'rxjs/operators';
import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppConstant } from '../constants/app.constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getToken() === null) {
      return next.handle(request)
        .pipe(timeout(AppConstant.NETWORK_TIMEOUT));
    }
    
    request = this.applyCredentials(request, this.authService.getToken());
    return next.handle(request)
      .pipe(timeout(AppConstant.NETWORK_TIMEOUT))
      .pipe(catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
          case 403:
            return this.handle401Error(request, next);

          default:
            return observableThrowError(error);
        }
      })
    );
  }

  applyCredentials(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.logoutUser(req, next);
  }

  logoutUser(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.clear();
    this.authService.handleError(req);
    this.router.navigate(['/login']);
    return observableEmpty();
  }

  mapErrorMessges(error) {
    console.log(error);
  }
}