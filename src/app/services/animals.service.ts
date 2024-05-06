import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, of, tap } from 'rxjs';
import { IAnimal } from '../interfaces/animal.interface';

@Injectable({
  providedIn: 'root',
})
export class AnimalsService {
  private animalsUrl = 'assets/database.json';
  private animalsCache: Observable<IAnimal[]> = of([]);

  constructor(private http: HttpClient) {}

  public getAnimals() {
    return this.animalsCache.pipe(
      concatMap((animals) => {
        if (animals.length) {
          return of(animals);
        }

        return this.http.get<IAnimal[]>(this.animalsUrl).pipe(
          tap((animals) => {
            this.animalsCache = of(animals);
          })
        );
      })
    );
  }

  public getAnimalById(id: string) {
    return this.getAnimals().pipe(
      concatMap((animals) => {
        return of(animals.find((animal) => animal.id === id));
      })
    );
  }
}
