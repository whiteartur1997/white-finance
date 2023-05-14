import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Wallet} from "../models/wallet";
import {BehaviorSubject, filter, map, Observable, shareReplay, tap} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class WalletsService {

  private readonly walletURL = 'https://white-finance-b9fce-default-rtdb.europe-west1.firebasedatabase.app/wallets'
  private walletsSubject = new BehaviorSubject<Wallet[]>([])
  private currentWalletSubject = new BehaviorSubject<Wallet | null>(null)
  private userId: string

  wallets$ = this.walletsSubject.asObservable()
  wallet$ = this.currentWalletSubject.asObservable()

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.auth.user$.pipe(
      filter(user => !!user),
    ).subscribe((user) => {
      if(user) {
        this.userId = user.localId
      }
    })
  }

  getWallets(): Observable<Wallet[]> {
      return this.http.get<{ [key: string]: Wallet }>(`${this.walletURL}.json`, {
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

  getWallet(walletId: string): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.walletURL}/${walletId}.json`).
      pipe(
        tap(wallet => this.currentWalletSubject.next(wallet)),
        shareReplay(),
      )
  }

  createWallet(wallet: Wallet) {
    this.http.post(`${this.walletURL}.json`, { ...wallet, userId: this.userId, }).subscribe(() => {
      this.getWallets().subscribe()
    });
  }

  editWallet(wallet: Wallet) {
    return this.http.put<Wallet>(`${this.walletURL}/${wallet.id}.json`, {...wallet})
  }

  deleteWallet(wallet: Wallet) {
    this.http.delete(`${this.walletURL}/${wallet.id}.json`).subscribe(() => {
      this.getWallets().subscribe()
    })
  }
}
