import {Component, OnInit} from '@angular/core';
import {WalletsService} from "../../services/wallets.service";
import {Observable} from "rxjs";
import {Wallet} from "../../models/wallet";

@Component({
  selector: 'app-wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.css']
})
export class WalletsListComponent implements OnInit {
  wallets$: Observable<Wallet[]> | undefined;
  constructor(public walletsService: WalletsService) {}

  ngOnInit() {
    this.walletsService.getWallets().subscribe()
  }
}
