import {Component, Input} from '@angular/core';
import {TransactionsService} from "../../services/transactions.service";
import {Wallet} from "../../models/wallet";
import {Transaction} from "../../models/transaction";

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent {
  @Input() wallet: Wallet;
  @Input() transactions: Transaction[];

  constructor(
    public transactionsService: TransactionsService
  ) {}
}
