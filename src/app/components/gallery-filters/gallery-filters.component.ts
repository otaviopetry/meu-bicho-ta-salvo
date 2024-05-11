import { Component } from '@angular/core';
import { AnimalsService } from '../../services/animals.service';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  COLOR_OPTIONS,
  SEX_OPTIONS,
  SIZE_OPTIONS,
} from '../../constants/constants';
import { AnimalSize } from '../../interfaces/animal.interface';

@Component({
  selector: 'app-gallery-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery-filters.component.html',
  styleUrl: './gallery-filters.component.scss',
})
export class GalleryFiltersComponent {
  public locationOptions$ = this.animalsService.locations$.asObservable();
  public colorOptions = COLOR_OPTIONS;
  public sizeOptions = SIZE_OPTIONS;
  public sexOptions = SEX_OPTIONS;

  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColor: string = '0';
  public selectedLocation: string = '0';

  constructor(private animalsService: AnimalsService) {
    //
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }

  public filterAnimals(): void {
    const filters = {
      sex: this.selectedSex !== '0' ? this.selectedSex : undefined,
      size: this.selectedSize !== '0' ? this.selectedSize : undefined,
      whereItIs:
        this.selectedLocation !== '0' ? this.selectedLocation : undefined,
      color: this.selectedColor !== '0' ? this.selectedColor : undefined,
    };

    this.animalsService.resetPagination();
    this.animalsService.getAnimalsFromDatabase(filters).catch((error) => {
      console.error('Error fetching filtered animals:', error);
    });
  }

  public resetFilter() {
    this.selectedSize = '0';
    this.selectedSex = '0';
    this.selectedColor = '0';
    this.selectedLocation = '0';
    this.animalsService.resetFilters();
    this.animalsService.loadInitialData();
  }
}
