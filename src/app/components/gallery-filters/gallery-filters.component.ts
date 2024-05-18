import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AnimalFilters, AnimalsService } from '../../services/animals.service';
import { capitalizeFirstWord } from '../../utils/label-functions';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
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
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs';
import { UserType } from '../../types/user-type.type';
import { ActivatedRoute } from '@angular/router';
import { ColorInputComponent } from './color-input/color-input.component';
import { SexInputComponent } from './sex-input/sex-input.component';
import { SizeInputComponent } from './size-input/size-input.component';
import { SpeciesInputComponent } from './species-input/species-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-gallery-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ColorInputComponent,
    SexInputComponent,
    SizeInputComponent,
    SpeciesInputComponent,
    MatAutocompleteModule,
  ],
  templateUrl: './gallery-filters.component.html',
  styleUrl: './gallery-filters.component.scss',
})
export class GalleryFiltersComponent {
  public speciesOptions = SPECIES_OPTIONS;
  public locationOptions$ = this.animalsService.locations$.asObservable();
  public temporaryHomeOptions$ =
    this.animalsService.temporaryHomeLocations$.asObservable();

  public sizeOptions = SIZE_OPTIONS;
  public sexOptions = SEX_OPTIONS;
  public colorOptions = COLOR_OPTIONS;

  public selectedSpecies: string = '0';
  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColors: { [color: string]: boolean } = {};

  public selectedLocation: string = '';
  public shelterForm!: FormGroup;
  public locationOptions: string[] = [];
  public filteredLocations: string[] = [];
  public showLocationSuggestions = false;
  public filledLocationWithSuggestion = false;

  public filtersForm!: FormGroup;

  public userType: UserType = 'tutor';

  private subscriptions: Subscription[] = [];

  @ViewChild('menuContainer', { static: true })
  menuContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private animalsService: AnimalsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    //
  }

  ngOnInit() {
    this.subscriptions.push(
      this.animalsService.userType$.subscribe((userType) => {
        this.userType = userType;
        this.selectedLocation = '';
      }),
      this.route.queryParams.subscribe((params) => {
        if (params['abrigo']) {
          this.selectedLocation = params['abrigo'];
        }
      }),
      this.animalsService.locations$.subscribe((locations) => {
        this.locationOptions = [...locations].sort();
        this.filteredLocations = [...this.locationOptions];
      })
    );
    this.buildShelterForm();
    this.buildForm();
    this.listenLocationChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public selectSuggestion(location: string) {
    this.selectedLocation = location;
    this.shelterForm.get('shelter')?.setValue(location);
    this.showLocationSuggestions = false;
    this.filledLocationWithSuggestion = true;
  }

  private buildShelterForm() {
    this.shelterForm = this.formBuilder.group({
      shelter: [''],
    });

    if (this.animalsService.selectedFilters.whereItIs?.length) {
      this.shelterForm
        .get('shelter')
        ?.setValue(this.animalsService.selectedFilters.whereItIs);
    }
  }

  public listenLocationChanges() {
    const shelterControl = this.shelterForm.get('shelter')?.valueChanges;

    if (shelterControl) {
      this.subscriptions.push(
        shelterControl
          .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap({
              next: (value) => {
                this.filledLocationWithSuggestion = false;

                if (value && !value.length) {
                  this.showLocationSuggestions = false;
                  this.filteredLocations = [];

                  return;
                }

                this.selectedLocation = value;
              },
            }),
            filter((value) => value?.length > 1)
          )
          .subscribe((value) => {
            this.filteredLocations = this.locationOptions.filter((location) =>
              location.toLowerCase().includes(value.toLowerCase())
            );

            const currentValue = this.shelterForm.get('shelter')?.value;

            if (value !== currentValue) {
              this.filledLocationWithSuggestion = false;
            }

            this.showLocationSuggestions = this.filteredLocations.length > 0;

            if (value.trim() === this.filteredLocations[0]) {
              this.filledLocationWithSuggestion = true;
            }
          })
      );
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.onEscPressed();
    }
  }

  private onEscPressed() {
    if (this.showLocationSuggestions) {
      this.showLocationSuggestions = false;
    }
  }

  buildForm(): void {
    this.filtersForm = this.formBuilder.group({
      species: this.formBuilder.array([]),
      size: this.formBuilder.array([]),
      sex: this.formBuilder.array([]),
      color: this.formBuilder.array([]),
    });

    this.speciesOptions.forEach(() =>
      this.species.push(new FormControl(false))
    );
    this.sizeOptions.forEach(() => this.sizes.push(new FormControl(false)));
    this.colorOptions.forEach(() => this.colors.push(new FormControl(false)));
    this.sexOptions.forEach(() => this.sexes.push(new FormControl(false)));
    this.populateFilters();
  }

  get species(): FormArray {
    return this.filtersForm.get('species') as FormArray;
  }

  get colors(): FormArray {
    return this.filtersForm.get('color') as FormArray;
  }

  get sexes(): FormArray {
    return this.filtersForm.get('sex') as FormArray;
  }

  get sizes(): FormArray {
    return this.filtersForm.get('size') as FormArray;
  }

  public onFilterAnimals() {
    this.menuContainer.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public filterAnimals(): void {
    let localFilters: AnimalFilters = {};

    this.animalsService.resetPagination();
    this.animalsService.resetAnimals();
    this.animalsService.filterAnimals$.next();

    const selectedColors = this.getSelectedColors();
    const selectedSexes = this.getSelectedSexes();
    const selectedSizes = this.getSelectedSizes();
    const selectedSpecies = this.getSelectedSpecies();

    if (this.selectedLocation !== '') {
      localFilters['whereItIs'] = this.selectedLocation;
    } else {
      localFilters = {
        species: selectedSpecies.length ? selectedSpecies : undefined,
        sex: selectedSexes.length ? selectedSexes : undefined,
        size: selectedSizes.length ? selectedSizes : undefined,
        color: selectedColors.length ? selectedColors : undefined,
      };
    }

    this.animalsService.getAnimalsFromDatabase(localFilters).catch((error) => {
      console.error('Error fetching filtered animals:', error);
    });
    this.onFilterAnimals();
  }

  public getSelectedSpecies() {
    return this.filtersForm.value.species
      .map((checked: boolean, i: number) =>
        checked ? this.speciesOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }

  public getSelectedSexes() {
    return this.filtersForm.value.sex
      .map((checked: boolean, i: number) =>
        checked ? this.sexOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }

  public getSelectedSizes() {
    return this.filtersForm.value.size
      .map((checked: boolean, i: number) =>
        checked ? this.sizeOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }

  public getSelectedColors() {
    return this.filtersForm.value.color
      .map((checked: boolean, i: number) =>
        checked ? this.colorOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }

  public resetFiltersWithoutLoadingData() {
    this.selectedSpecies = '0';
    this.selectedSize = '0';
    this.selectedSex = '0';
    this.filtersForm.reset();
    this.shelterForm.reset();
    this.showLocationSuggestions = false;
    this.selectedLocation = '';
    this.animalsService.resetFilters();
    this.onFilterAnimals();
  }

  public resetFilterAndLoadInitialData() {
    this.resetFiltersWithoutLoadingData();
    this.animalsService.loadInitialData();
  }

  private populateFilters() {
    const filters = { ...this.animalsService.selectedFilters };

    if (filters.species?.length) {
      this.speciesOptions.forEach((option, index) => {
        if (filters.species?.includes(option)) {
          this.species.at(index).setValue(true);
        }
      });
    }

    if (filters.size?.length) {
      this.sizeOptions.forEach((option, index) => {
        if (filters.size?.includes(option)) {
          this.sizes.at(index).setValue(true);
        }
      });
    }

    if (filters.sex?.length) {
      this.sexOptions.forEach((option, index) => {
        if (filters.sex?.includes(option)) {
          this.sexes.at(index).setValue(true);
        }
      });
    }

    if (filters.color?.length) {
      this.colorOptions.forEach((option, index) => {
        if (filters.color?.includes(option)) {
          this.colors.at(index).setValue(true);
        }
      });
    }
  }
}
