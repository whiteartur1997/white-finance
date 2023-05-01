import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  constructor(private auth: AuthService) {
  }

  onLogin(authForm: NgForm) {
    const { email, password } = authForm.value;
    this.auth.login(email, password);
  }

  onSignup(authForm: NgForm) {
    const { email, password } = authForm.value;
    this.auth.register(email, password);
  }
}
