import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WalletsService} from "../../services/wallets.service";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  public id: string;

  constructor(
    private route: ActivatedRoute,
    private walletsService: WalletsService,
  ) {
    this.id = route.snapshot.params["id"]
  }

  ngOnInit() {
    this.walletsService.getWallets()
  }

}
