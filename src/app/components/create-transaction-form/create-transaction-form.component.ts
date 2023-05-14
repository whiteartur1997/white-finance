import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Wallet} from "../../models/wallet";
import {CategoriesService} from "../../services/categories.service";
import {ModalService} from "../../services/modal.service";
import {dateNotInFutureValidator} from "../../shared/date-not-in-future.validator";
import {Subscription} from "rxjs";
import {TransactionsService} from "../../services/transactions.service";
import {Category} from "../../models/category";

@Component({
  selector: 'app-create-transaction-form',
  templateUrl: './create-transaction-form.component.html',
  styleUrls: ['./create-transaction-form.component.css']
})
export class CreateTransactionFormComponent implements OnInit, OnDestroy {

  @Input() wallet: Wallet;
  transactionForm: FormGroup;
  categories: Category[] = [];
  private categoriesSubscription: Subscription;
  constructor(
    public categoriesService: CategoriesService,
    public transactionsService: TransactionsService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.categoriesSubscription = this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories
    })
    this.transactionForm = new FormGroup({
      amount: new FormControl(undefined, [Validators.required, Validators.min(0.01), Validators.max(this.wallet.amount)]),
      categoryId: new FormControl(undefined, [Validators.required]),
      walletId: new FormControl(this.wallet.id, { nonNullable: true }),
      currency: new FormControl(this.wallet.currency, { nonNullable: true }),
      date: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required, dateNotInFutureValidator]),
    })
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe()
  }

  onSubmit() {
    const expenseType = this.categories.find(cat => cat.id === this.transactionForm.value.categoryId)?.type;
    const expenseAmount = this.transactionForm.value.amount;
    this.transactionsService.createTransaction(this.transactionForm.value, {...this.wallet, amount: expenseType === "expense" ? this.wallet.amount - expenseAmount : this.wallet.amount + expenseAmount})
    this.modalService.close()
  }

  onCancel() {
    this.transactionForm.reset()
    this.modalService.close()
  }
}
