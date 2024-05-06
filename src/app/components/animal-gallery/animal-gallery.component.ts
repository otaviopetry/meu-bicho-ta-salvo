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

@Component({
  selector: 'app-animal-gallery',
  standalone: true,
  imports: [AnimalCardComponent, FormsModule, HttpClientModule],
  providers: [AnimalsService],
  templateUrl: './animal-gallery.component.html',
  styleUrl: './animal-gallery.component.scss',
})
export class AnimalGalleryComponent implements OnInit {
  public initialAnimals: IAnimal[] = [];
  public animals: IAnimal[] = [];

  public sizeOptions: AnimalSize[] = ['pequeno', 'médio', 'grande'];
  public sexOptions: AnimalSex[] = ['fêmea', 'macho', 'não se sabe'];
  public colorOptions: string[] = [];

  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColor: string = '0';

  constructor(private animalsService: AnimalsService) {
    //
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
        },
      });
  }

  private getColorOptions() {
    return this.animals.reduce((acc: string[], animal) => {
      if (!acc.includes(animal.color)) {
        acc.push(animal.color);
      }

      return acc;
    }, []);
  }

  public capitalizeFirstWord(phrase: string) {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  }

  public filterAnimals() {
    const shouldFilterSize = this.selectedSize !== '0';
    const shouldFilterSex = this.selectedSex !== '0';
    const shouldFilterColor = this.selectedColor !== '0';

    this.animals = this.initialAnimals.filter((animal) => {
      const sizeMatch = !shouldFilterSize || animal.size === this.selectedSize;
      const colorMatch =
        !shouldFilterColor || animal.color === this.selectedColor;
      const sexMatch = !shouldFilterSex || animal.sex === this.selectedSex;

      return sizeMatch && colorMatch && sexMatch;
    });
  }

  public resetFilter() {
    this.selectedSize = '0';
    this.selectedSex = '0';
    this.selectedColor = '0';
    this.animals = this.initialAnimals;
  }
}
