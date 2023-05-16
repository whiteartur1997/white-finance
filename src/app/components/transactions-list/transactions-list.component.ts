import {Component, Input, OnInit} from '@angular/core';
import {TransactionsService} from "../../services/transactions.service";
import {Wallet} from "../../models/wallet";

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
  @Input() wallet: Wallet;

  constructor(
    public transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    this.transactionsService.getTransactionsByWalletId(this.wallet.id).subscribe()
  }
}
