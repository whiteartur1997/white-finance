import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WalletsService} from "../../services/wallets.service";
import {ModalService} from "../../services/modal.service";
import {map, Observable, Subscription} from "rxjs";
import {TransactionsService} from "../../services/transactions.service";
import {Transaction} from "../../models/transaction";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, OnDestroy {
  id: string;
  subscription: Subscription;
  listOfDaysAndTransactions$: Observable<Array<{ date: Date, transactions: Transaction[] }>> = this.transactionsService.transactions$.pipe(map((transactions) => {
    const obj = transactions.reduce((acc, curr) => {
      !acc[curr.date] ? acc[curr.date] = [curr] : acc[curr.date].push(curr)
      return acc
    }, {} as { [key: string]: Transaction[] })
    return Object.entries(obj).map(([date, transactions]) => ({ date: new Date(date), transactions })).sort((a, b) => b.date.getTime() - a.date.getTime())
  }));

  constructor(
    private route: ActivatedRoute,
    public walletsService: WalletsService,
    public modalService: ModalService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.walletsService.getWallet(this.id).subscribe((wallet) => {
        this.transactionsService.getTransactionsByWalletId(wallet.id).subscribe()
      });
    });
  }

  isEditedTransactionPresented() {
    return this.transactionsService.transaction$.pipe(
      map(transaction => Boolean(transaction))
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.walletsService.resetWallet()
  }
}
