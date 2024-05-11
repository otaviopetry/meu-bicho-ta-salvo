import { Component } from '@angular/core';
import { AnimalsService } from '../../services/animals.service';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  COLOR_OPTIONS,
  SEX_OPTIONS,
  SIZE_OPTIONS,
  SPECIES_OPTIONS,
} from '../../constants/constants';
import { AnimalSize } from '../../interfaces/animal.interface';
import { Subscription } from 'rxjs';
import { UserType } from '../../types/user-type.type';

@Component({
  selector: 'app-gallery-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery-filters.component.html',
  styleUrl: './gallery-filters.component.scss',
})
export class GalleryFiltersComponent {
  public speciesOptions = SPECIES_OPTIONS;
  public locationOptions$ = this.animalsService.locations$.asObservable();
  public colorOptions = COLOR_OPTIONS;
  public sizeOptions = SIZE_OPTIONS;
  public sexOptions = SEX_OPTIONS;

  public selectedSpecies: string = '0';
  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColor: string = '0';
  public selectedLocation: string = '0';

  public userType: UserType = 'tutor';

  private subscriptions: Subscription[] = [];

  constructor(private animalsService: AnimalsService) {
    //
  }

  ngOnInit() {
    this.populateFilters();
    this.subscriptions.push(
      this.animalsService.userType$.subscribe((userType) => {
        this.userType = userType;
        this.resetFiltersWithoutLoadingData();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }

  public filterAnimals(): void {
    const filters = {
      species: this.selectedSpecies !== '0' ? this.selectedSpecies : undefined,
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

  public resetFiltersWithoutLoadingData() {
    this.selectedSpecies = '0';
    this.selectedSize = '0';
    this.selectedSex = '0';
    this.selectedColor = '0';
    this.selectedLocation = '0';
    this.animalsService.resetFilters();
  }

  public resetFilterAndLoadInitialData() {
    this.resetFiltersWithoutLoadingData();
    this.animalsService.loadInitialData();
  }

  private populateFilters() {
    if (this.animalsService.selectedFilters['species']) {
      this.selectedSpecies = this.animalsService.selectedFilters['species'];
    }

    if (this.animalsService.selectedFilters['size']) {
      this.selectedSize = this.animalsService.selectedFilters['size'];
    }

    if (this.animalsService.selectedFilters['sex']) {
      this.selectedSex = this.animalsService.selectedFilters['sex'];
    }

    if (this.animalsService.selectedFilters['color']) {
      this.selectedColor = this.animalsService.selectedFilters['color'];
    }

    if (this.animalsService.selectedFilters['whereItIs']) {
      this.selectedLocation = this.animalsService.selectedFilters['whereItIs'];
    }
  }
}
