import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category} from "../models/category";
import {BehaviorSubject, map, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly categoriesURL = 'https://white-finance-b9fce-default-rtdb.europe-west1.firebasedatabase.app/categories'
  private categoriesSubject = new BehaviorSubject<Category[]>([])
  categories$ = this.categoriesSubject.asObservable()

  constructor(
    private httpClient: HttpClient
  ) {}

  getCategories() {
    return this.httpClient.get<{ [key: string]: Category }>(`${this.categoriesURL}.json`).pipe(
      map(categories => {
        return Object.entries(categories).reduce((acc: Category[], [key, value]) => {
          acc.push({ ...value, id: key})
          return acc;
        }, []) as Category[]
      }),
      tap((categories) => this.categoriesSubject.next(categories)),
      shareReplay()
    )
  }
}
