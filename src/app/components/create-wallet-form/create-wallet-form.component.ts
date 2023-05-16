import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {WalletsService} from "../../services/wallets.service";
import {Subscription} from "rxjs";
import {Wallet} from "../../models/wallet";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-create-wallet-form',
  templateUrl: './create-wallet-form.component.html',
  styleUrls: ['./create-wallet-form.component.css']
})
export class CreateWalletFormComponent implements OnInit, OnDestroy {
  @Input() editMode = false;
  @Input() wallet: Partial<Wallet> = { name: '', currency: 'UAH', amount: 0 };
  @Output() walletWasEdited = new EventEmitter();
  currency = "UAH";
  walletsSub: Subscription | undefined
  public walletNames: string[] | undefined;

  constructor(
    public walletsService: WalletsService,
    private modalService: ModalService
  ) {
  }

  onCreateWallet(walletForm: NgForm) {
    this.walletsService.createWallet(walletForm.value)
    this.onCancel(walletForm);
  }

  onEditWallet(walletForm: NgForm) {
    this.walletsService.editWallet({...this.wallet, ...walletForm.value}).subscribe(() => {
      this.walletsService.getWallets().subscribe()
      this.walletWasEdited.emit()
      this.modalService.close()
    })
  }

  ngOnInit() {
    this.walletsSub = this.walletsService.wallets$.subscribe(wallets => {
      if(this.editMode) console.log("this.walletNames = wallets.filter(wn => wn.name !== this.wallet.name).map(w => w.name)", this.walletNames = wallets.filter(wn => wn.name !== this.wallet.name).map(w => w.name))
      return this.walletNames = wallets.filter(wn => wn.name !== this.wallet.name).map(w => w.name)
    })
  }

  ngOnDestroy() {
    if(this.walletsSub) {
      this.walletsSub.unsubscribe()
    }
  }

  onCancel(walletForm: NgForm) {
    !this.editMode ? walletForm.resetForm({ name: '', currency: 'UAH', amount: 0 }) : this.modalService.close()
  }
}
