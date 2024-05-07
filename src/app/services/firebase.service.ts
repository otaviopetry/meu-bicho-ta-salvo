import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { IAnimal } from '../interfaces/animal.interface';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  constructor() {}

  async getAnimals() {
    try {
      const animalCol = collection(this.db, 'animals');
      const animalSnapshot = await getDocs(animalCol);
      const animalList = animalSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return animalList;
    } catch (error) {
      console.error('Error fetching animals:', error);
      throw new Error('Failed to fetch animals');
    }
  }
}
