import { Component, Input } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AnimalsService } from '../../../services/animals.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shelter-input',
  standalone: true,
  imports: [MatAutocompleteModule, ReactiveFormsModule, CommonModule],
  templateUrl: './shelter-input.component.html',
  styleUrl: './shelter-input.component.scss',
})
export class ShelterInputComponent {
  @Input() public shelterForm: FormGroup = new FormGroup({});
  @Input() public shelterOptions: string[] | null = [];

  public selectedLocation: string = '';
  public filteredShelters: Observable<string[]> = of([]);

  constructor(private animalsService: AnimalsService) {}

  ngOnInit() {
    this.listenLocationChanges();
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

    if (!this.shelterOptions) return [];

    return this.shelterOptions.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
