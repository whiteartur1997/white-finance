import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {WalletsService} from "../../services/wallets.service";

@Component({
  selector: 'app-create-wallet-form',
  templateUrl: './create-wallet-form.component.html',
  styleUrls: ['./create-wallet-form.component.css']
})
export class CreateWalletFormComponent {

  constructor(private walletsService: WalletsService) {
  }

  onCreateWallet(walletForm: NgForm) {
    this.walletsService.createWallet(walletForm.value)
  }
}
