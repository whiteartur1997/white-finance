import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WalletsService} from "../../services/wallets.service";
import {ModalService} from "../../services/modal.service";
import {map, Subscription} from "rxjs";
import {TransactionsService} from "../../services/transactions.service";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit, OnDestroy {
  id: string;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    public walletsService: WalletsService,
    public modalService: ModalService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.walletsService.getWallet(this.id).subscribe();
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
