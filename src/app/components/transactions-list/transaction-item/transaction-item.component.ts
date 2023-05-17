import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Transaction} from "../../../models/transaction";
import {CategoriesService} from "../../../services/categories.service";
import {Category} from "../../../models/category";
import {Subscription} from "rxjs";
import {TransactionsService} from "../../../services/transactions.service";
import {Wallet} from "../../../models/wallet";
import {ModalService} from "../../../services/modal.service";

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.css']
})
export class TransactionItemComponent implements OnInit, OnDestroy {
  @Input() wallet: Wallet;
  @Input() transaction: Transaction;
  transactionDate: Date;
  transactionCategory: Category | undefined;
  categories: Category[]
  categoriesSub: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private modalService: ModalService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    this.categoriesSub = this.categoriesService.categories$.subscribe(categories => {
      this.categories = categories;
      this.transactionCategory = categories.find(cat => cat.id === this.transaction.categoryId)
    })
    this.transactionDate = new Date(this.transaction.date)
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe()
  }

  onEditTransaction(transaction: Transaction) {
    this.transactionsService.setCurrentTransaction(transaction)
    this.modalService.open('create-transaction')
  }

  onDeleteTransaction(transaction: Transaction) {
    const expenseType = this.categories.find(cat => cat.id === this.transaction.categoryId)?.type;
    const expenseAmount = transaction.amount;
    this.transactionsService.deleteTransaction(transaction.id, {...this.wallet, amount: expenseType === "expense" ? this.wallet.amount + expenseAmount : this.wallet.amount - expenseAmount})
  }
}
