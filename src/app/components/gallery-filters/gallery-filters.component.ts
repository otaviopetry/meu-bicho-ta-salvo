import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimalFilters, AnimalsService } from '../../services/animals.service';
import { capitalizeFirstWord } from '../../utils/label-functions';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import {
  COLOR_OPTIONS,
  SEX_OPTIONS,
  SIZE_OPTIONS,
  SPECIES_OPTIONS,
} from '../../constants/constants';
import { Subscription } from 'rxjs';
import { UserType } from '../../types/user-type.type';
import { ActivatedRoute } from '@angular/router';
import { ColorInputComponent } from './color-input/color-input.component';
import { SexInputComponent } from './sex-input/sex-input.component';
import { SizeInputComponent } from './size-input/size-input.component';
import { SpeciesInputComponent } from './species-input/species-input.component';

@Component({
  selector: 'app-gallery-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColorInputComponent,
    SexInputComponent,
    SizeInputComponent,
    SpeciesInputComponent,
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
  public selectedLocation: string = '0';

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
        this.populateFilters();
        this.selectedLocation = '0';
      })
    );
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        if (params['abrigo']) {
          this.selectedLocation = params['abrigo'];
        }
      })
    );
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
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

    if (this.selectedLocation !== '0') {
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
    this.selectedLocation = '0';
    this.animalsService.resetFilters();
    this.onFilterAnimals();
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
