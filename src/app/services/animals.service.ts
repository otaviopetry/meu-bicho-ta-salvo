import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  concatMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { IAnimal } from '../interfaces/animal.interface';
import { UserType } from '../types/user-type.type';

export interface AnimalFilters {
  species?: string;
  sex?: string;
  size?: string;
  whereItIs?: string;
  color?: { [color: string]: boolean };
  startAfter?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnimalsService {
  private allAnimals: IAnimal[] = [];
  private animalsCache = new BehaviorSubject<IAnimal[]>([]);
  private nextPageToken?: string = '';
  public hasMorePages = true;

  public loading = false;
  public loading$ = new BehaviorSubject<boolean>(false);

  public itemsPerPage = 35;
  private currentFilters: HttpParams = new HttpParams();
  public selectedFilters: AnimalFilters = {};

  public locations$ = new BehaviorSubject<string[]>([]);
  public temporaryHomeLocations$ = new BehaviorSubject<string[]>([]);
  public userType$ = new BehaviorSubject<UserType>('tutor');
  public animalCount$ = new Subject<number>();

  public filterAnimals$ = new Subject<void>();
  public resetFilters$ = new Subject<void>();

  constructor(private http: HttpClient) {
    //
  }

  public loadInitialData() {
    this.getAnimalsFromDatabase()
      .then((response) => {
        this.allAnimals = response.animals;
      })
      .catch((error) => {
        console.error('Error fetching initial data:', error);
        this.animalsCache.next([]);
      });
  }

  public async getAnimalsFromDatabase(
    filters: AnimalFilters = {},
    isLoadingNextPage?: boolean
  ): Promise<{ animals: IAnimal[]; nextPageToken: string }> {
    this.loading$.next(true);
    this.currentFilters = this.createQueryParams(filters);
    this.selectedFilters = { ...filters };

    const apiEndpoint = `https://bicho-salvo-api-production.up.railway.app/animals?${this.currentFilters.toString()}&limit=${
      this.itemsPerPage
    }`;

    try {
      const response = await this.http
        .get<{ animals: IAnimal[]; nextPageToken: string }>(apiEndpoint)
        .toPromise();
      this.loading$.next(false);

      if (!response || !response.animals) {
        throw new Error('No animals found or end of data reached');
      }

      if (response.nextPageToken) {
        this.nextPageToken = response.nextPageToken;
      }

      if (response.animals.length === 0 && !isLoadingNextPage) {
        this.animalsCache.next([]);
      }

      if (response.animals.length > 0) {
        this.animalsCache.next(response.animals);
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
      const nextPageFilters: any = {};

      this.currentFilters.keys().forEach((key) => {
        nextPageFilters[key] = this.currentFilters.get(key);
      });
      nextPageFilters.startAfter = this.nextPageToken;

      this.getAnimalsFromDatabase(nextPageFilters, true).then((response) => {
        this.hasMorePages = response.animals.length >= this.itemsPerPage;
      });
    }
  }

  public getAnimals(): Observable<IAnimal[]> {
    return this.animalsCache.asObservable();
  }

  public getAnimalById(id: string): Observable<IAnimal | undefined> {
    return this.http.get<IAnimal>(
      `https://bicho-salvo-api-production.up.railway.app/animal/${id}`
    );
  }

  public loadLocations() {
    return this.http
      .get<{ locations: string[] }>(
        `https://bicho-salvo-api-production.up.railway.app/locations`
      )
      .subscribe({
        next: (response) => {
          this.locations$.next(response.locations);
        },
      });
  }

  public loadTemporaryHomeLocations() {
    return this.http
      .get<{ locations: string[] }>(
        `https://bicho-salvo-api-production.up.railway.app/temporary-homes`
      )
      .subscribe({
        next: (response) => {
          this.temporaryHomeLocations$.next(response.locations);
        },
      });
  }

  public loadAnimalCount() {
    return this.http
      .get<{ count: number }>(
        'https://bicho-salvo-api-production.up.railway.app/animal-count'
      )
      .subscribe({
        next: (response) => {
          this.animalCount$.next(response.count);
        },
      });
  }

  public resetPagination(): void {
    this.nextPageToken = undefined;
    this.hasMorePages = true;
  }

  public resetFilters(): void {
    this.resetFilters$.next();
    this.currentFilters = new HttpParams();
    this.selectedFilters = {};
    this.nextPageToken = undefined;
    this.hasMorePages = true;
    this.loadInitialData();
  }

  public resetAnimals() {
    this.allAnimals = [];
  }

  public changeUserType(userType: UserType) {
    this.userType$.next(userType);
  }

  private createQueryParams(filters: AnimalFilters): HttpParams {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            params = params.append(key, item);
          });
        } else {
          params = params.append(key, value);
        }
      }
    });

    return params;
  }

  public handleShelterDirectAccess(shelter: string) {
    this.selectedFilters.whereItIs = shelter;
    this.getAnimalsFromDatabase(this.selectedFilters)
      .then((response) => {
        if (response.animals.length > 0) {
          this.allAnimals = response.animals;
          this.animalsCache.next(this.allAnimals);
        }
      })
      .catch((error) => {
        console.error('Failed to load shelter data:', error);
      });
  }
}
