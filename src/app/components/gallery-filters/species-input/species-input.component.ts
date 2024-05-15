import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { capitalizeFirstWord } from '../../../utils/label-functions';

@Component({
  selector: 'app-species-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './species-input.component.html',
  styleUrl: './species-input.component.scss',
})
export class SpeciesInputComponent {
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() speciesOptions: readonly string[] = [];

  public showDropdown = false;

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public getSelectedSpecies() {
    return this.formGroup.value.species
      .map((checked: boolean, i: number) =>
        checked ? this.speciesOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public closeSpeciesMenu() {
    this.showDropdown = false;
  }
}
