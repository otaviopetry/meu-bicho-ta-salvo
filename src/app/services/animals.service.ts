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
  color?: string;
  startAfter?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnimalsService {
  private allAnimals: IAnimal[] = [];
  private animalsCache = new ReplaySubject<IAnimal[]>(1);
  private nextPageToken?: string = '';
  public hasMorePages = true;

  public loading = false;
  public loading$ = new BehaviorSubject<boolean>(false);

  public itemsPerPage = 35;
  private currentFilters: HttpParams = new HttpParams();
  public selectedFilters: AnimalFilters = {};

  public locations$ = new BehaviorSubject<string[]>([]);
  public userType$ = new BehaviorSubject<UserType>('tutor');
  public animalCount$ = new Subject<number>();

  constructor(private http: HttpClient) {
    //
  }

  public loadInitialData() {
    // this.animalsCache.next(this.getStaticData());

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
    // this.animalsCache.next(this.getStaticData());

    // return Promise.resolve({
    //   animals: this.getStaticData(),
    //   nextPageToken: '',
    // });

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

      this.getAnimalsFromDatabase(nextPageFilters, true)
        .then((response) => {
          if (response.animals.length > 0) {
            this.allAnimals = [...this.allAnimals, ...response.animals];
            this.animalsCache.next(this.allAnimals);
          }

          this.hasMorePages = response.animals.length >= this.itemsPerPage;
        })
        .catch((error) => {
          console.error('Failed to load next page:', error);
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
    this.currentFilters = new HttpParams();
    this.selectedFilters = {};
    this.nextPageToken = undefined;
    this.hasMorePages = true;
  }

  public changeUserType(userType: UserType) {
    this.userType$.next(userType);
  }

  private createQueryParams(filters: AnimalFilters): HttpParams {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.append(key, value);
      }
    });

    return params;
  }

  private getStaticData(): IAnimal[] {
    return [
      {
        id: '0ayp3TkNteCF0TjVlaOL',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'g',
        color: 'Caramelo claro e branco',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/3b6c7405-580d-4aa1-87bd-6de81a62ba23-1715126889578-41.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: '17t4atIJKaMCsZutB9Qe',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'g',
        color: 'Branco',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/819c07e9-d92c-4899-a5bf-667ab410729a-1715126054134-36.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: '2PaonJVcpA66rJTx7B82',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'g',
        color: 'Caramelo',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'macho',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/6cecf066-9163-4d52-857e-f6e18e4fc659-1715124676602-34.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: '45yFR6U4E6WcNQM2l1nH',
        whereWasFound:
          'Sans Souci, Eldorado do Sul - Resgatado por Vitor - Triagem em Pontal POA',
        characteristics:
          'Pelagem com manchas pretas e brancas no focinho e brancas nas patas.',
        hair: 'Longo',
        contactInformation: 'Paula (51) 99399 7631',
        size: 'g',
        color: 'Caramelo ',
        species: 'cachorro',
        whereItIs:
          'Encaminhado para LT - Cristóvão Colombo, 1085 (Clínica Vet)',
        sex: 'macho',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/b7f4144d-9836-4fb0-a29d-870a26efadb1-1715126341054-28.webp',
          'https://meubichotasalvo.s3.amazonaws.com/225038ac-50a6-423d-ada6-1091a7613395-1715126341060-29.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: '6AK4qjBiB8rhrwcm4hs5',
        whereWasFound:
          'Resgate provável em Eldorado, Sarandi ou Humaita - Triagem Pontal POA',
        characteristics: '',
        hair: 'Longo',
        contactInformation: '@pontalanimais',
        size: 'p',
        color: 'Cinza/Preto',
        species: 'cachorro',
        whereItIs: 'Parque Esportivo da PUCRS',
        sex: 'macho',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/e39ba581-ddb1-43b1-bae9-c21c24793c09-1715127098121-11b.webp',
          'https://meubichotasalvo.s3.amazonaws.com/15cb5723-d0e5-4488-8a49-2e790acc55ee-1715127098071-11.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'CmzWb9Q6F0aW7NxCCgZT',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'p',
        color: 'Branco, preto e marrom',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/c2625b18-b623-4b06-9e71-8e12e06e843e-1715124573261-31.2.webp',
          'https://meubichotasalvo.s3.amazonaws.com/99530f96-fd31-456f-b055-5759676527ec-1715124573268-31.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'Eg7W2vc0n8rHknMzQJQh',
        whereWasFound:
          'Sans Souci, Eldorado do Sul - Resgatado por Vitor - Triagem em Pontal POA',
        characteristics: '',
        hair: 'Curto',
        contactInformation: 'Paula (51) 99399 7631',
        size: 'g',
        color: 'Branco com preto',
        species: 'cachorro',
        whereItIs:
          'Encaminhada para LT - Cristóvão Colombo, 1085 (Clínica Vet)',
        sex: 'fêmea',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/367b9ab1-cbbb-45b2-9b16-019c52e308de-1715127382519-12.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'GBMi4nfXpe7zz7MLGCis',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'm',
        color: 'Branco e marrom',
        species: '',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/71a4ebb7-a945-42fb-96c5-93b546f02ff7-1715124514887-30.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'GCxxcOn2rmmJPbfnNUit',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'm',
        color: 'Preto e caramelo',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'fêmea',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/b5213e63-b0a7-4589-b00f-34c5d0722a3e-1715124750555-35.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'SN7GHMQwU0QAmd4fZ5oV',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'm',
        color: 'Preto',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/4668a4fd-f8af-4d29-b692-b0407d61e855-1715126149081-38.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'T2RC9MN4jZrLHU8tvStT',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'g',
        color: 'Caramelo',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'macho',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/bc305237-3f43-4bb6-8b68-5b491f973368-1715126099763-37.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'UwnuvUMcTmpFW0d7aGPS',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'm',
        color: 'Branco e preto',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/e253befa-8da7-42b5-956a-3b2187ddbb14-1715124390432-29.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'ZKixghKHAQCSA6QLr8ef',
        whereWasFound: '',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '',
        size: 'g',
        color: 'Preto',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/61fb1d4b-da5f-48b2-8798-a4909876d19d-1715126324377-39.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'fHbH2OgoYMlwHk9JFN1Z',
        whereWasFound:
          'Sans Souci, Eldorado do Sul - Resgatado por Vitor - Triagem em Pontal POA',
        characteristics: 'Não castrado',
        hair: 'Curto',
        contactInformation: 'Paula (51) 99399 7631',
        size: 'g',
        color: 'Caramelo com branco',
        species: 'cachorro',
        whereItIs:
          'Encaminhado para LT - Cristóvão Colombo, 1085 (Clínica Vet)',
        sex: 'macho',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/6c83b3f7-ee68-4c63-80ef-1e2b7106094f-1715126867780-10b.webp',
          'https://meubichotasalvo.s3.amazonaws.com/35b7d4da-eb98-4450-aa8e-fb2c6e257c32-1715126867785-09.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'jEqlVt7XoBash3A7PMFv',
        whereWasFound:
          'Sans Souci, Eldorado do Sul - Resgatado por Vitor - Triagem em Pontal POA',
        characteristics: 'Não castrado',
        hair: 'Curto',
        contactInformation: 'Paula (51) 99399 7631',
        size: 'm',
        color: 'Preto com branco',
        species: 'cachorro',
        whereItIs:
          'Encaminhado para LT - Cristóvão Colombo, 1085 (Clínica Vet)',
        sex: 'macho',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/15b0dbc7-97d0-454c-8239-847ebab103b3-1715126578589-08.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'ppRlA0CBBVBVRHjsHjrY',
        whereWasFound: 'Sarandi',
        characteristics: '',
        hair: 'Longo',
        contactInformation: '51980140572 @ceminluisa',
        size: 'g',
        color: 'Caramelo',
        species: 'cachorro',
        whereItIs: 'Lar temporário em Porto Alegre',
        sex: 'fêmea',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/19da3cc9-70ff-4175-8494-b6aebd4a34a8-1715128071498-104.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'qwsDHuNGLXmgjZDwQmlL',
        whereWasFound: 'Sarandi',
        characteristics: '',
        hair: 'Curto',
        contactInformation: 'Guilherme @guihdias02',
        size: 'p',
        color: 'Preto e caramelo',
        species: 'cachorro',
        whereItIs: 'Lar temporário',
        sex: 'macho',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/ef9768a4-8344-44ed-9612-318f38e963f6-1715127472411-101.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'r0xex8NpOpICORaejRIY',
        whereWasFound: '',
        characteristics: '',
        hair: 'Longo',
        contactInformation: '',
        size: 'p',
        color: 'Preto',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/f120e639-5765-42b8-a7cf-6bd8e7ea89f6-1715124642681-33.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 't0YvVKylthIjCCjOgpcw',
        whereWasFound: 'Abrigo Drop Bar',
        characteristics: '',
        hair: 'Curto',
        contactInformation: '54 999181221 @natiomizzollo',
        size: 'm',
        color: 'Caramelo claro e branco',
        species: 'cachorro',
        whereItIs: 'Lar temporário',
        sex: 'fêmea',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/a40606df-5210-4f8f-8282-99be9067f51a-1715127907244-103%201.webp',
          'https://meubichotasalvo.s3.amazonaws.com/995ab956-79cf-434d-bc9c-517c0f1bb9b8-1715127907654-103%202.webp',
          'https://meubichotasalvo.s3.amazonaws.com/0ddcd72a-c6f4-46f0-8e75-7a9b99c3dfec-1715127907785-103%203.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'tWea1PfMmNkKZiWS6w71',
        whereWasFound: 'Sarandi',
        characteristics: '',
        hair: 'Curto',
        contactInformation: 'Guilherme @guihdias02',
        size: 'm',
        color: 'Preto',
        species: 'cachorro',
        whereItIs: 'Lar temporário',
        sex: 'fêmea',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/32416105-e3c7-4180-9b85-9e5f6329f1d6-1715127577305-102.webp',
        ],
        foundOwner: false,
        breed: '',
      },
      {
        id: 'vIoRxzV5DVXfis03cCOw',
        whereWasFound: '',
        characteristics: '',
        hair: 'Longo',
        contactInformation: '',
        size: 'm',
        color: 'Branco',
        species: 'cachorro',
        whereItIs:
          'FGTAS - Vida Centro Humanístico, Av. Baltazar de Oliveira Garcia, 2132, Porto Alegre',
        sex: 'não se sabe',
        imageURLs: [
          'https://meubichotasalvo.s3.amazonaws.com/bce3ea90-a1ff-4e11-bed4-828ea4146ebc-1715123695699-28.webp',
        ],
        foundOwner: false,
        breed: '',
      },
    ];
  }
}
