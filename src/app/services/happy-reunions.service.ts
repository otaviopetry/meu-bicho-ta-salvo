import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAnimal } from '../interfaces/animal.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HappyReunionsService {
  public allAnimals: IAnimal[] = [];
  public reunitedAnimalsCache = new BehaviorSubject<IAnimal[]>([]);
  private nextPageToken?: string = '';
  public hasMorePages = true;
  public loading$ = new BehaviorSubject<boolean>(false);

  public itemsPerPage = 50;

  constructor(private http: HttpClient) {
    //
  }

  public getAnimals(): Observable<IAnimal[]> {
    return this.reunitedAnimalsCache.asObservable();
  }

  public async loadHappyReunitedAnimals(
    isLoadingNextPage?: boolean
  ): Promise<{ animals: IAnimal[]; nextPageToken: string }> {
    this.loading$.next(true);

    try {
      const response = await this.http
        .get<{ animals: IAnimal[]; nextPageToken: string }>(
          `https://bicho-salvo-api-production.up.railway.app/happy-reunions?limit=${this.itemsPerPage}&nextPageToken=${this.nextPageToken}`
        )
        .toPromise();

      this.loading$.next(false);

      if (!response || !response.animals) {
        throw new Error('No animals found or end of data reached');
      }

      if (response.nextPageToken) {
        this.nextPageToken = response.nextPageToken;
      }

      if (response.animals.length === 0 && !isLoadingNextPage) {
        this.reunitedAnimalsCache.next([]);
      }

      if (response.animals.length > 0) {
        this.allAnimals = [...this.allAnimals, ...response.animals];
        this.reunitedAnimalsCache.next(this.allAnimals);
      }

      return response;
    } catch (error) {
      this.loading$.next(false);
      console.error('Failed to fetch animals:', error);
      throw new Error('Failed to fetch animals');
    }
  }

  public loadNextPage(): void {
    if (this.nextPageToken && this.hasMorePages) {
      this.loadHappyReunitedAnimals(true).then((response) => {
        this.hasMorePages = response.animals.length >= this.itemsPerPage;
      });
    }
  }
}
