import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WalletsService} from "../../services/wallets.service";
import {Wallet} from "../../models/wallet";
import {Observable} from "rxjs";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  public wallet$: Observable<Wallet> | undefined

  constructor(
    private route: ActivatedRoute,
    private walletsService: WalletsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params["id"]
    if(id) {
      this.wallet$ = this.walletsService.getWallet(id)
    }

  }

}
