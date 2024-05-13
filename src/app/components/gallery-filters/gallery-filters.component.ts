import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimalFilters, AnimalsService } from '../../services/animals.service';
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
  public temporaryHomeOptions$ =
    this.animalsService.temporaryHomeLocations$.asObservable();
  public colorOptions = COLOR_OPTIONS;
  public sizeOptions = SIZE_OPTIONS;
  public sexOptions = SEX_OPTIONS;

  public selectedSpecies: string = '0';
  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColors: { [color: string]: boolean } = {};
  public selectedLocation: string = '0';

  showDropdown = false;

  public userType: UserType = 'tutor';

  private subscriptions: Subscription[] = [];

  @ViewChild('menuContainer', { static: true })
  menuContainer!: ElementRef<HTMLDivElement>;

  constructor(private animalsService: AnimalsService) {
    //
  }

  ngOnInit() {
    this.subscriptions.push(
      this.animalsService.userType$.subscribe((userType) => {
        this.userType = userType;
        this.populateFilters();
        this.selectedLocation = '0';
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public closeColorMenu() {
    this.showDropdown = false;
    this.menuContainer.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }

  public getSelectedColors() {
    return Object.keys(this.selectedColors);
  }

  public filterAnimals(): void {
    let localFilters: AnimalFilters = {};

    this.showDropdown = false;
    this.animalsService.resetPagination();

    if (this.selectedLocation !== '0') {
      localFilters['whereItIs'] = this.selectedLocation;
    } else {
      localFilters = {
        species:
          this.selectedSpecies !== '0' ? this.selectedSpecies : undefined,
        sex: this.selectedSex !== '0' ? this.selectedSex : undefined,
        size: this.selectedSize !== '0' ? this.selectedSize : undefined,
        color: Object.entries(this.selectedColors).length
          ? this.selectedColors
          : undefined,
      };
    }

    this.animalsService.getAnimalsFromDatabase(localFilters).catch((error) => {
      console.error('Error fetching filtered animals:', error);
    });
  }

  public resetFiltersWithoutLoadingData() {
    this.selectedSpecies = '0';
    this.selectedSize = '0';
    this.selectedSex = '0';
    this.selectedColors = {};
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
      this.selectedColors = this.animalsService.selectedFilters['color'];
    }

    if (this.animalsService.selectedFilters['whereItIs']) {
      this.selectedLocation = this.animalsService.selectedFilters['whereItIs'];
    }
  }
}
