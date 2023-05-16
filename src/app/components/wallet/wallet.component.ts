import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WalletsService} from "../../services/wallets.service";
import {ModalService} from "../../services/modal.service";
import {Subscription} from "rxjs";

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
    public modalService: ModalService
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.walletsService.getWallet(this.id).subscribe();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.walletsService.resetWallet()
  }
}
