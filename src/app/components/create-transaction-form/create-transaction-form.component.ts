import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Wallet} from "../../models/wallet";
import {CategoriesService} from "../../services/categories.service";
import {ModalService} from "../../services/modal.service";
import {dateNotInFutureValidator} from "../../shared/date-not-in-future.validator";
import {Subscription} from "rxjs";
import {TransactionsService} from "../../services/transactions.service";
import {Category} from "../../models/category";
import {Transaction} from "../../models/transaction";

@Component({
  selector: 'app-create-transaction-form',
  templateUrl: './create-transaction-form.component.html',
  styleUrls: ['./create-transaction-form.component.css']
})
export class CreateTransactionFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() editMode: boolean;
  @Input() wallet: Wallet;

  transactionForm: FormGroup;

  categories: Category[] = [];
  transaction: Transaction | null = null;

  private categoriesSubscription: Subscription;
  private transactionSubscription: Subscription;

  constructor(
    public categoriesService: CategoriesService,
    public transactionsService: TransactionsService,
    private modalService: ModalService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.initializeForm()
  }

  ngOnInit() {
    this.categoriesSubscription = this.categoriesService.categories$.subscribe(categories => this.categories = categories)
    this.transactionSubscription = this.transactionsService.transaction$.subscribe(transaction => this.transaction = transaction)
    this.initializeForm()
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe()
  }

  onSubmit() {
    const transactionType = this.categories.find(cat => cat.id === this.transactionForm.value.categoryId)?.type;
    const transactionAmount = +this.transactionForm.value.amount;
    console.log(transactionAmount)
    // TODO - think about util function
    if(this.editMode && this.transaction) {
      const transactionBeforeUpdateType = this.categories.find(cat => cat.id === this.transaction?.categoryId)?.type;
      const walletWithoutOldAmount = {...this.wallet, amount: transactionBeforeUpdateType === "expense" ? this.wallet.amount + this.transaction.amount : this.wallet.amount - this.transaction.amount}
      this.transactionsService.editTransaction(
        {
          ...this.transaction,
          ...this.transactionForm.value
        },
        {
          ...walletWithoutOldAmount,
          amount: transactionType === "expense"
            ? walletWithoutOldAmount.amount - transactionAmount
            : walletWithoutOldAmount.amount + transactionAmount
        })
      this.transactionsService.resetCurrentTransaction()
    } else {
      this.transactionsService.createTransaction(
        this.transactionForm.value,
        {
          ...this.wallet,
          amount: transactionType === "expense"
            ? this.wallet.amount - transactionAmount
            : this.wallet.amount + transactionAmount
        }
        )
    }

    this.transactionForm.reset()
    this.modalService.close()
  }

  onCancel() {
    this.transactionForm.reset()
    this.transactionsService.resetCurrentTransaction()
    this.modalService.close()
  }

  private initializeForm() {
    this.transactionForm = new FormGroup({
      amount: new FormControl(this.transaction ? this.transaction.amount : undefined, [Validators.required, Validators.min(0.01), Validators.max(this.wallet.amount)]),
      categoryId: new FormControl(this.transaction ? this.transaction.categoryId : undefined, [Validators.required]),
      walletId: new FormControl(this.wallet.id, { nonNullable: true }),
      currency: new FormControl(this.wallet.currency, { nonNullable: true }),
      date: new FormControl((this.transaction ? new Date(this.transaction.date) : new Date()).toISOString().substring(0, 10), [Validators.required, dateNotInFutureValidator]),
    })
  }
}
