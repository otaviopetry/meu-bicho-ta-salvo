import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAnimal } from '../interfaces/animal.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private apiEndpoint =
    'https://bicho-salvo-api-production.up.railway.app/animals';

  constructor(private http: HttpClient) {}

  async getAnimals(): Promise<IAnimal[] | undefined> {
    try {
      return this.http.get<IAnimal[]>(`${this.apiEndpoint}`).toPromise();
    } catch (error) {
      console.error('Error fetching animals:', error);
      throw new Error('Failed to fetch animals');
    }
  }
}
