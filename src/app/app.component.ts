import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {CategoriesService} from "./services/categories.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'white-finance';

  constructor(
    public authService: AuthService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log(isLoggedIn)
      if(isLoggedIn) {
        this.categoriesService.getCategories().subscribe();
      }
    })
  }
}
