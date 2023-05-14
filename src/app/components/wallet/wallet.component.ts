import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WalletsService} from "../../services/wallets.service";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public walletsService: WalletsService,
    public modalService: ModalService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params["id"]
    if(id) {
      this.walletsService.getWallet(id).subscribe()
    }

  }

}
