import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimalFilters, AnimalsService } from '../../services/animals.service';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  COLOR_OPTIONS,
  SEX_OPTIONS,
  SIZE_OPTIONS,
  SPECIES_OPTIONS,
} from '../../constants/constants';
import { AnimalSize } from '../../interfaces/animal.interface';
import { Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { UserType } from '../../types/user-type.type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gallery-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gallery-filters.component.html',
  styleUrl: './gallery-filters.component.scss',
})
export class GalleryFiltersComponent {
  public speciesOptions = SPECIES_OPTIONS;
  public temporaryHomeOptions$ =
    this.animalsService.temporaryHomeLocations$.asObservable();
  public colorOptions = COLOR_OPTIONS;
  public sizeOptions = SIZE_OPTIONS;
  public sexOptions = SEX_OPTIONS;

  public selectedSpecies: string = '0';
  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColors: { [color: string]: boolean } = {};
  public selectedLocation: string = '';

  public shelterForm!: FormGroup;
  public locationOptions: string[] = [];
  public filteredLocations: string[] = [];
  public showLocationSuggestions = false;

  showDropdown = false;

  public userType: UserType = 'tutor';

  private subscriptions: Subscription[] = [];

  @ViewChild('menuContainer', { static: true })
  menuContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private animalsService: AnimalsService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    //
  }

  ngOnInit() {
    this.subscriptions.push(
      this.animalsService.userType$.subscribe((userType) => {
        this.userType = userType;
        this.populateFilters();
        this.selectedLocation = '';
      })
    );
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        if (params['abrigo']) {
          this.selectedLocation = params['abrigo'];
        }
      }),
      this.animalsService.locations$.subscribe((locations) => {
        this.locationOptions = locations;
      })
    );
    this.shelterForm = this.fb.group({
      shelter: [''],
    });
    this.listenLocationChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public listenLocationChanges() {
    const shelterControl = this.shelterForm.get('shelter')?.valueChanges;

    if (shelterControl) {
      this.subscriptions.push(
        shelterControl
          .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter((value) => value.length > 0)
          )
          .subscribe((value) => {
            this.filteredLocations = this.locationOptions.filter((location) =>
              location.toLowerCase().includes(value.toLowerCase())
            );
            console.log('===>', value);
            console.log('===>', this.filteredLocations);

            this.showLocationSuggestions = this.filteredLocations.length > 0;
          })
      );
    }
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

    if (this.selectedLocation !== '') {
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
    this.selectedLocation = '';
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
