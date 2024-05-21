import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimalFilters, AnimalsService } from '../../services/animals.service';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { CommonModule } from '@angular/common';
import {
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
import { Subscription } from 'rxjs';
import { UserType } from '../../types/user-type.type';
import { ActivatedRoute } from '@angular/router';
import { ShelterInputComponent } from './shelter-input/shelter-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AnimalSize } from '../../interfaces/animal.interface';

@Component({
  selector: 'app-gallery-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShelterInputComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './gallery-filters.component.html',
  styleUrl: './gallery-filters.component.scss',
})
export class GalleryFiltersComponent {
  public shelterOptions$ = this.animalsService.locations$.asObservable();
  public temporaryHomeOptions$ =
    this.animalsService.temporaryHomeLocations$.asObservable();

  public speciesFormControl = new FormControl<string[]>([]);
  public speciesOptions = SPECIES_OPTIONS;

  public sizeFormControl = new FormControl<string[]>([]);
  public sizeOptions = SIZE_OPTIONS;

  public sexFormControl = new FormControl<string[]>([]);
  public sexOptions = SEX_OPTIONS;

  public colorFormControl = new FormControl<string[]>([]);
  public colorOptions = COLOR_OPTIONS;

  public filtersForm!: FormGroup;
  public shelterForm!: FormGroup;

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
      this.checkShelterQueryParam()
    );
    this.buildShelterForm();
    this.buildFiltersForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private listenUserTypeChange() {
    return this.animalsService.userType$.subscribe((userType) => {
      const currentType = this.userType;

      this.userType = userType;
      this.shelterForm?.reset();

      if (currentType !== userType) {
        this.onFilterAnimals();
      }
    });
  }

  private checkShelterQueryParam() {
    return this.route.queryParams.subscribe((params) => {
      if (params['abrigo']) {
        this.shelterForm.get('shelter')?.setValue(params['abrigo']);
      }
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
      species: this.speciesFormControl,
      size: this.sizeFormControl,
      sex: this.sexFormControl,
      color: this.colorFormControl,
    });

    this.populateFilters();
  }

  public onFilterAnimals() {
    const offset = 100; // Set your desired offset here
    const menuElement = this.menuContainer.nativeElement;
    const elementPosition = menuElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
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

    const selectedColors = this.colorFormControl.value;
    const selectedSexes = this.sexFormControl.value;
    const selectedSizes = this.sizeFormControl.value;
    const selectedSpecies = this.speciesFormControl.value;

    if (this.shelterForm.get('shelter')?.value) {
      localFilters['whereItIs'] = this.shelterForm.get('shelter')?.value;
    } else {
      localFilters = {
        species: selectedSpecies?.length ? selectedSpecies : undefined,
        sex: selectedSexes?.length ? selectedSexes : undefined,
        size: selectedSizes?.length ? selectedSizes : undefined,
        color: selectedColors?.length ? selectedColors : undefined,
      };
    }

    this.animalsService.getAnimalsFromDatabase(localFilters).catch((error) => {
      console.error('Error fetching filtered animals:', error);
    });
    this.onFilterAnimals();
  }

  public resetFilterAndLoadInitialData() {
    this.filtersForm.reset();
    this.shelterForm.reset();
    this.animalsService.resetFilters();
    this.onFilterAnimals();
  }

  private populateFilters() {
    const filters = { ...this.animalsService.selectedFilters };

    if (filters.species?.length) {
      this.speciesFormControl.setValue(filters.species);
    }

    if (filters.size?.length) {
      this.sizeFormControl.setValue(filters.size);
    }

    if (filters.sex?.length) {
      this.sexFormControl.setValue(filters.sex);
    }

    if (filters.color?.length) {
      this.colorFormControl.setValue(filters.color);
    }
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }
}
