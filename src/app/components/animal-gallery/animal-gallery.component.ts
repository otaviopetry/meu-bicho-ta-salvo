import { Component, HostListener, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animal-gallery',
  standalone: true,
  imports: [
    AnimalCardComponent,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './animal-gallery.component.html',
  styleUrl: './animal-gallery.component.scss',
})
export class AnimalGalleryComponent implements OnInit {
  public initialAnimals: IAnimal[] = [];
  public animals: IAnimal[] = [];

  public sizeOptions: AnimalSize[] = ['p', 'm', 'g'];
  public sexOptions: AnimalSex[] = ['fêmea', 'macho', 'não se sabe'];
  public colorOptions: string[] = [
    'preto',
    'branco',
    'caramelo',
    'laranja',
    'colorido',
    'outros',
  ];
  public locationOptions$ = this.animalsService.locations$.asObservable();

  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColor: string = '0';
  public selectedLocation: string = '0';

  public loading = false;
  public loading$ = this.animalsService.loading$.asObservable();

  constructor(private animalsService: AnimalsService, private router: Router) {
    this.loading = true;
  }

  ngOnInit() {
    this.getAnimals();
  }

  private getAnimals() {
    this.animalsService.getAnimals().subscribe({
      next: (animals) => {
        this.initialAnimals = animals;
        this.animals = animals;
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
      if (animal.whereItIs.length > 0) {
        locationSet.add(animal.whereItIs);
      }
    }

    return Array.from(locationSet);
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public filterAnimals(): void {
    const filters = {
      sex: this.selectedSex !== '0' ? this.selectedSex : undefined,
      size: this.selectedSize !== '0' ? this.selectedSize : undefined,
      whereItIs:
        this.selectedLocation !== '0' ? this.selectedLocation : undefined,
      color: this.selectedColor !== '0' ? this.selectedColor : undefined,
    };

    this.animalsService.getAnimalsFromDatabase(filters).catch((error) => {
      console.error('Error fetching filtered animals:', error);
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

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.loading &&
      this.animalsService.hasMorePages
    ) {
      this.loading = true;
      this.animalsService.loadNextPage();

      setTimeout(() => {
        this.loading = false;
      }, 600);
    }
  }
}
