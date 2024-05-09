import { Component, OnInit } from '@angular/core';
import {
  AnimalSex,
  AnimalSize,
  IAnimal,
} from '../../interfaces/animal.interface';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { FormsModule } from '@angular/forms';
import { AnimalsService } from '../../services/animals.service';
import { take } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-animal-gallery',
  standalone: true,
  imports: [AnimalCardComponent, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './animal-gallery.component.html',
  styleUrl: './animal-gallery.component.scss',
})
export class AnimalGalleryComponent implements OnInit {
  public initialAnimals: IAnimal[] = [];
  public animals: IAnimal[] = [];

  public sizeOptions: AnimalSize[] = ['p', 'm', 'g'];
  public sexOptions: AnimalSex[] = ['fêmea', 'macho', 'não se sabe'];
  public colorOptions: string[] = [];
  public locationOptions: string[] = [];

  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColor: string = '0';
  public selectedLocation: string = '0';

  public loading = false;

  constructor(private animalsService: AnimalsService, private router: Router) {
    this.loading = true;
  }

  ngOnInit() {
    this.getAnimals();
  }

  private getAnimals() {
    this.animalsService
      .getAnimals()
      .pipe(take(1))
      .subscribe({
        next: (animals) => {
          this.initialAnimals = animals;
          this.animals = animals;
          this.colorOptions = this.getColorOptions();
          this.locationOptions = this.getLocationOptions();
          this.loading = false;
        },
      });
  }

  private getColorOptions(): string[] {
    const colorSet = new Set<string>();

    for (const animal of this.animals) {
      colorSet.add(animal.color);
    }
    return Array.from(colorSet);
  }

  private getLocationOptions(): string[] {
    const locationSet = new Set<string>();

    for (const animal of this.animals) {
      locationSet.add(animal.whereItIs);
    }

    return Array.from(locationSet);
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public filterAnimals() {
    const shouldFilterSize = this.selectedSize !== '0';
    const shouldFilterSex = this.selectedSex !== '0';
    const shouldFilterColor = this.selectedColor !== '0';
    const shouldFilterLocation = this.selectedLocation !== '0';

    this.animals = this.initialAnimals.filter((animal) => {
      const sizeMatch = !shouldFilterSize || animal.size === this.selectedSize;
      const colorMatch =
        !shouldFilterColor || animal.color === this.selectedColor;
      const sexMatch = !shouldFilterSex || animal.sex === this.selectedSex;
      const locationMatch =
        !shouldFilterLocation || animal.whereItIs === this.selectedLocation;

      return sizeMatch && colorMatch && sexMatch && locationMatch;
    });
  }

  public resetFilter() {
    this.selectedSize = '0';
    this.selectedSex = '0';
    this.selectedColor = '0';
    this.selectedLocation = '0';
    this.animals = this.initialAnimals;
  }

  public navigateToAnimal(id: string) {
    this.router.navigate(['/animais', id]);
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }
}
