import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimalFilters, AnimalsService } from '../../services/animals.service';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
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
import { AnimalSize } from '../../interfaces/animal.interface';
import { Subscription } from 'rxjs';
import { UserType } from '../../types/user-type.type';
import { ActivatedRoute } from '@angular/router';
import { ColorInputComponent } from './color-input/color-input.component';

@Component({
  selector: 'app-gallery-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorInputComponent],
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
      species: [[]],
      size: [[]],
      sex: [[]],
      color: this.formBuilder.array([]),
    });
    this.colorOptions.forEach(() => this.colors.push(new FormControl(false)));
  }

  get colors(): FormArray {
    return this.filtersForm.get('color') as FormArray;
  }

  public closeColorMenu() {
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

  public filterAnimals(): void {
    const selectedColors = this.filtersForm.value.color
      .map((checked: boolean, i: number) =>
        checked ? this.colorOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
    console.log('===> submit filters', selectedColors);
    // let localFilters: AnimalFilters = {};

    // this.animalsService.resetPagination();
    // this.animalsService.resetAnimals();
    // this.animalsService.filterAnimals$.next();

    // if (this.selectedLocation !== '0') {
    //   localFilters['whereItIs'] = this.selectedLocation;
    // } else {
    //   localFilters = {
    //     species:
    //       this.selectedSpecies !== '0' ? this.selectedSpecies : undefined,
    //     sex: this.selectedSex !== '0' ? this.selectedSex : undefined,
    //     size: this.selectedSize !== '0' ? this.selectedSize : undefined,
    //     color: Object.entries(this.selectedColors).length
    //       ? this.selectedColors
    //       : undefined,
    //   };
    // }

    // this.animalsService.getAnimalsFromDatabase(localFilters).catch((error) => {
    //   console.error('Error fetching filtered animals:', error);
    // });
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
