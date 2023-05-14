import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Transaction} from "../../../models/transaction";
import {CategoriesService} from "../../../services/categories.service";
import {Category} from "../../../models/category";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.css']
})
export class TransactionItemComponent implements OnInit, OnDestroy {
  @Input() transaction: Transaction;
  transactionDate: Date;
  transactionCategory: Category | undefined;
  categoriesSub: Subscription;

  constructor(
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.categoriesSub = this.categoriesService.categories$.subscribe(categories => {
      this.transactionCategory = categories.find(cat => cat.id === this.transaction.categoryId)
    })
    this.transactionDate = new Date(this.transaction.date)
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe()
  }
}
