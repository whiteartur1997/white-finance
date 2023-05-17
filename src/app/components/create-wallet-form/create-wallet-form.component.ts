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
  private defaultWalletValues = { name: '', currency: 'UAH', amount: undefined }

  @Input() editMode = false;
  @Input() wallet: Partial<Wallet> = this.defaultWalletValues as unknown as Wallet;
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
    this.walletsService.createWallet({...walletForm.value, amount: +walletForm.value.amount})
    this.onCancel(walletForm);
  }

  onEditWallet(walletForm: NgForm) {
    this.walletsService.editWallet({...this.wallet, ...walletForm.value, amount: +walletForm.value.amount}).subscribe(() => {
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
    !this.editMode ? walletForm.resetForm(this.defaultWalletValues) : this.modalService.close()
  }
}
