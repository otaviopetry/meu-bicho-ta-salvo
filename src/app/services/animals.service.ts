import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, concatMap, of, switchMap, tap } from 'rxjs';
import { IAnimal } from '../interfaces/animal.interface';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AnimalsService {
  private animalsCache = new ReplaySubject<IAnimal[]>(1);

  constructor(private firestoreService: FirebaseService) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.firestoreService
      .getAnimals()
      .then((animals) => {
        this.animalsCache.next(animals as IAnimal[]);
      })
      .catch((error) => {
        this.animalsCache.next([]);
      });
  }

  public getAnimals(): Observable<IAnimal[]> {
    return this.animalsCache.asObservable();
  }

  public getAnimalById(id: string): Observable<IAnimal | undefined> {
    return this.getAnimals().pipe(
      switchMap((animals) => of(animals.find((animal) => animal.id === id)))
    );
  }
}
