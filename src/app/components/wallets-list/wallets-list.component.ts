import {Component, OnInit} from '@angular/core';
import {WalletsService} from "../../services/wallets.service";
import {Observable} from "rxjs";
import {Wallet} from "../../models/wallet";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.css']
})
export class WalletsListComponent implements OnInit {
  editedWallet: Wallet | null = null;
  wallets$: Observable<Wallet[]> | undefined;
  constructor(
    public walletsService: WalletsService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.walletsService.getWallets().subscribe()
  }

  onDelete(wallet: Wallet) {
    this.walletsService.deleteWallet(wallet);
  }

  onEdit(modalId: string, wallet: Wallet) {
    this.modalService.open(modalId)
    this.editedWallet = wallet
  }
}
