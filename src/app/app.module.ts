import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { CreateWalletFormComponent } from './components/create-wallet-form/create-wallet-form.component';
import { WalletsListComponent } from './components/wallets-list/wallets-list.component';
import {AuthInterceptorService} from "./services/auth-interceptor.service";
import {ForbiddenNameDirective} from "./shared/forbidden-name.directive";
import { ModalComponent } from './components/modal/modal.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { WalletPageComponent } from './components/wallet-page/wallet-page.component';
import { CreateTransactionFormComponent } from './components/create-transaction-form/create-transaction-form.component';
import { TransactionsListComponent } from './components/transactions-list/transactions-list.component';
import { TransactionItemComponent } from './components/transactions-list/transaction-item/transaction-item.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    HeaderComponent,
    CreateWalletFormComponent,
    WalletsListComponent,
    ForbiddenNameDirective,
    ModalComponent,
    WalletComponent,
    WalletPageComponent,
    CreateTransactionFormComponent,
    TransactionsListComponent,
    TransactionItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
