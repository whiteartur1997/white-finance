import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, combineLatest, filter} from "rxjs";
import {Transaction} from "../models/transaction";
import {AuthService} from "../auth/auth.service";
import {WalletsService} from "./wallets.service";
import {Wallet} from "../models/wallet";

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private readonly transactionURL = 'https://white-finance-b9fce-default-rtdb.europe-west1.firebasedatabase.app/transactions'
  private transactionsSubject = new BehaviorSubject<Transaction[]>([])
  transactions$ = this.transactionsSubject.asObservable()
  private userId: string

  constructor(
    // TODO add interceptor for attaching userId to body where applicable
    private http: HttpClient,
    private auth: AuthService,
    private walletsService: WalletsService
  ) {
    this.auth.user$.pipe(
      filter(user => !!user)
    ).subscribe(user => {
      if(user) {
        this.userId = user.localId
      }
    })
  }

  createTransaction(transaction: Transaction, wallet: Wallet) {
    const createTransaction$ = this.http.post<Transaction>(`${this.transactionURL}.json`, { ...transaction, userId: this.userId  })
    const updateWalletBalance$ = this.walletsService.editWallet(wallet)

    const combined$ = combineLatest([createTransaction$, updateWalletBalance$])
    combined$.subscribe(([_, wallet]) => {
      this.walletsService.getWallet(wallet.id).subscribe()
    })
  }
}
