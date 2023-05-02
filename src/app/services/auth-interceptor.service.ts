import {Injectable, OnInit} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {exhaustMap, Observable, of, take} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {User} from "../models/user";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  private user: User | null | undefined;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(user => this.user = user)
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(this.user).pipe(
      take(1),
      exhaustMap(user => {
        if(!user) {
          return next.handle(req)
        } else {
          const modifiedReq = req.clone({
            params: req.params.append('auth', user.idToken)
          })
          return next.handle(modifiedReq)
        }
      })
    )
  }
}
