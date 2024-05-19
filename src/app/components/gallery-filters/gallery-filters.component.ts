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
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
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
  public filteredShelters: Observable<string[]> = of([]);

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
      this.listenUserTypeChange(),
      this.checkShelterQueryParam(),
      this.getLocationOptions()
    );
    this.buildShelterForm();
    this.buildFiltersForm();
    this.listenLocationChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private listenUserTypeChange() {
    return this.animalsService.userType$.subscribe((userType) => {
      this.userType = userType;
      this.selectedLocation = '';
    });
  }

  private checkShelterQueryParam() {
    return this.route.queryParams.subscribe((params) => {
      if (params['abrigo']) {
        this.selectedLocation = params['abrigo'];
      }
    });
  }

  private getLocationOptions() {
    return this.animalsService.locations$.subscribe((locations) => {
      this.locationOptions = [...locations].sort();
    });
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

  private buildFiltersForm(): void {
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

  public listenLocationChanges() {
    const shelterControl = this.shelterForm.get('shelter')?.valueChanges;

    if (shelterControl) {
      this.filteredShelters = shelterControl.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);

    return this.locationOptions.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
