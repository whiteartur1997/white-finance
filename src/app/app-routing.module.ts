import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuardService} from "./auth/auth-guard.service";
import {NoAuthGuardService} from "./auth/no-auth-guard.service";
import {WalletPageComponent} from "./components/wallet-page/wallet-page.component";
import {WalletComponent} from "./components/wallet/wallet.component";
import {WalletsListComponent} from "./components/wallets-list/wallets-list.component";

const routes: Routes = [
  { path: 'auth', component: AuthComponent, canActivate: [NoAuthGuardService]  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  {
    path: 'wallets',
    component: WalletPageComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      { path: ':id', component: WalletComponent },
      { path: '', component: WalletsListComponent }
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
