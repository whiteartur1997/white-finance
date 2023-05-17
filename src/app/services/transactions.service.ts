import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, tap} from "rxjs";
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
  private currentTransactionSubject = new BehaviorSubject<Transaction | null>(null)

  transactions$ = this.transactionsSubject.asObservable()
  transaction$ = this.currentTransactionSubject.asObservable()

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

  getTransactionsByWalletId(walletId: string) {
    return this.http.get<{ [key: string]: Transaction }>(`${this.transactionURL}.json`, {
      params: {
        orderBy: '"walletId"',
        equalTo: `"${walletId}"`
      }
    }).pipe(
      map(transactions => {
        return Object.entries(transactions).reduce((acc: Transaction[], [key, value]) => {
          acc.push({ ...value, id: key })
          return acc
        }, [])
      }),
      tap(transactions => this.transactionsSubject.next(transactions)),
      shareReplay()
    )
  }

  createTransaction(transaction: Transaction, wallet: Wallet) {
    const createTransaction$ = this.http.post<Transaction>(`${this.transactionURL}.json`, { ...transaction, userId: this.userId  })

    this.reflectChangesInTransactionAndWallet(createTransaction$, wallet)
  }

  editTransaction(transaction: Transaction, wallet: Wallet) {
    const editTransaction$ = this.http.put<Transaction>(`${this.transactionURL}/${transaction.id}.json`, transaction)

    this.reflectChangesInTransactionAndWallet(editTransaction$, wallet)
  }

  deleteTransaction(transactionId: string, wallet: Wallet) {
    const deleteTransaction$ = this.http.delete(`${this.transactionURL}/${transactionId}.json`)

    this.reflectChangesInTransactionAndWallet(deleteTransaction$, wallet)
  }

  setCurrentTransaction(transaction: Transaction) {
    this.currentTransactionSubject.next(transaction)
  }

  resetCurrentTransaction() {
    this.currentTransactionSubject.next(null)
  }

  private reflectChangesInTransactionAndWallet(transactionObs$: Observable<any>, wallet: Wallet) {
    const updateWalletBalance$ = this.walletsService.editWallet(wallet)

    const combined$ = combineLatest([transactionObs$, updateWalletBalance$])
    combined$.subscribe(([_, wallet]) => {
      this.walletsService.getWallet(wallet.id).subscribe()
      this.getTransactionsByWalletId(wallet.id).subscribe()
    })
  }
}
