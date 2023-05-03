import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Wallet} from "../models/wallet";
import {BehaviorSubject, filter, map, Observable, shareReplay, tap} from "rxjs";
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
        console.log(user);
        this.userId = user.localId
      }
    })
  }

  getWallets(): Observable<Wallet[]> {
      return this.http.get<{ [key: string]: Wallet }>(this.walletURL, {
        params: {
          orderBy: '"userId"',
          equalTo: `"${this.userId!}"`
        }
      }).pipe(
        map(wallets => {
          return Object.entries(wallets).reduce((acc: Wallet[], [key, value]) => {
            acc.push({ ...value, id: key})
            return acc;
          }, []) as Wallet[]
        }),
        tap((wallets) => this.walletsSubject.next(wallets)),
        shareReplay()
      )
  }

  createWallet(wallet: Wallet) {
    this.http.post(this.walletURL, { ...wallet, userId: this.userId, }).subscribe(() => {
      this.getWallets().subscribe()
    });
  }
}
