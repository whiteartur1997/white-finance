import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuardService} from "./auth/auth-guard.service";
import {NoAuthGuardService} from "./auth/no-auth-guard.service";

const routes: Routes = [
  { path: 'auth', component: AuthComponent, canActivate: [NoAuthGuardService]  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/home', pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
