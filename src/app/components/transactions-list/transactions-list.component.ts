import {Component, Input, OnInit} from '@angular/core';
import {TransactionsService} from "../../services/transactions.service";
import {Transaction} from "../../models/transaction";
import {Observable} from "rxjs";

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
  @Input() walletId: string

  transactions$: Observable<Transaction[]>

  constructor(
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    console.log("walletId", this.walletId)
    this.transactions$ = this.transactionsService.getTransactionsByWalletId(this.walletId)
  }
}
