import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Wallet} from "../models/wallet";
import {BehaviorSubject, filter, Observable, shareReplay} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class WalletsService {

  private readonly walletURL = 'https://white-finance-b9fce-default-rtdb.europe-west1.firebasedatabase.app/wallets.json'
  private walletsSubject = new BehaviorSubject<Wallet[]>([])
  wallets$ = this.walletsSubject.asObservable()
  private userId: string | undefined
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.auth.user$.pipe(
      filter(user => !!user),
    ).subscribe((user) => {
      if(user) {
        this.userId = user.idToken
      }
    })
  }

  getWallets(): Observable<Wallet[]> {
      return this.http.get<Wallet[]>(this.walletURL, {
        params: {
          orderBy: encodeURIComponent("userId"),
          equalTo: `"${this.userId!}"`
        }
      }).pipe(
        shareReplay()
      )
  }

  createWallet(wallet: Wallet) {
    this.http.post(this.walletURL, wallet)
  }
}
