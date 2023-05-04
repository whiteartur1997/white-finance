import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class NoAuthGuardService implements CanActivate {

  private isLoggedOut: boolean = false

  constructor(private auth: AuthService, private router: Router) {
    this.auth.isLoggedOut$.subscribe(isLoggedOut => this.isLoggedOut = isLoggedOut)
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.isLoggedOut) {
      this.router.navigate(["/home"])
    }
    return this.isLoggedOut
  }
}
