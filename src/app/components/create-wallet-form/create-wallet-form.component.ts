import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {WalletsService} from "../../services/wallets.service";
import {Subscription} from "rxjs";
import {Wallet} from "../../models/wallet";

@Component({
  selector: 'app-create-wallet-form',
  templateUrl: './create-wallet-form.component.html',
  styleUrls: ['./create-wallet-form.component.css']
})
export class CreateWalletFormComponent implements OnInit, OnDestroy {
  @Input() editMode = false;
  @Input() wallet: Partial<Wallet> = { name: '', currency: 'UAH', amount: 0 };
  currency = "UAH";
  walletsSub: Subscription | undefined
  public walletNames: string[] | undefined;

  constructor(public walletsService: WalletsService) {
  }

  onCreateWallet(walletForm: NgForm) {
    this.walletsService.createWallet(walletForm.value)
    this.resetForm(walletForm);
  }

  ngOnInit() {
    this.walletsSub = this.walletsService.wallets$.subscribe(wallets => this.walletNames = wallets.map(w => w.name))
  }

  ngOnDestroy() {
    if(this.walletsSub) {
      this.walletsSub.unsubscribe()
    }
  }

  resetForm(walletForm: NgForm) {
    walletForm.resetForm({ name: '', currency: 'UAH', amount: 0 })
  }
}
