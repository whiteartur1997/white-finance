import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from "rxjs";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

const API_KEY = "AIzaSyA3jf43O_2APQuAvasGEECNGxfgu8x6XLs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null)
  private authErrorSubject = new BehaviorSubject<string | null>(null)
  user$: Observable<User | null> = this.userSubject.asObservable()
  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  )
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(
    map(isLoggedIn => !isLoggedIn)
  )
  error$: Observable<string | null> = this.authErrorSubject.asObservable()
  private readonly authURL = "https://identitytoolkit.googleapis.com/v1/accounts"
  private readonly authKeyLS = 'user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.autoLogin();
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if(isLoggedIn) {
        this.autoLogout()
      }
    })
  }

  login(email: string, password: string) {
    this.http.post<User>(`${this.authURL}:signInWithPassword?key=${API_KEY}`, { email, password, returnSecureToken: true })
      .pipe(
        tap((user) => {
          this.handleAuthAction(user)
        }),
        catchError((err) => {
          this.handleAuthError(err)
          return throwError(err)
        })
      )
      .subscribe()
  }

  register(email: string, password: string) {
    this.http.post<User>(`${this.authURL}:signUp?key=${API_KEY}`, { email, password, returnSecureToken: true })
      .pipe(
        tap(user => {
          this.handleAuthAction(user)
        }),
        catchError((err) => {
          this.handleAuthError(err)
          return throwError(err)
        })
      ).subscribe()
  }

  logout() {
    this.userSubject.next(null)
    localStorage.removeItem(this.authKeyLS)
    this.router.navigate(["/auth"])
  }

  autoLogin() {
    const user = localStorage.getItem(this.authKeyLS)
    if(user) {
      const parsedUser: User = JSON.parse(user);
      if(parsedUser.expirationDateInMs > Date.now()) {
        this.userSubject.next(parsedUser);
      }
    }
  }

  autoLogout() {
    const user = this.userSubject.getValue();
    if(user) {
      const timeUntilExpiration = user.expirationDateInMs - Date.now();
      console.log(timeUntilExpiration)
      setTimeout(() => {
        this.logout();
      }, timeUntilExpiration)
    }
  }

  private handleAuthAction(user: User) {
    const expirationDateInMs = Date.now() + +user.expiresIn * 1000;
    this.userSubject.next({...user, expirationDateInMs})
    localStorage.setItem(this.authKeyLS, JSON.stringify({...user, expirationDateInMs}))
    this.autoLogout();
    this.router.navigate(["/home"])
  }

  private handleAuthError(error: any) {
    const message = "Error occurred";
    this.authErrorSubject.next(message);
    return throwError(error)
  }
}
