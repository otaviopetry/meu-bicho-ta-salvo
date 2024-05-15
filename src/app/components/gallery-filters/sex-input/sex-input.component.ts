import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { capitalizeFirstWord } from '../../../utils/label-functions';

@Component({
  selector: 'app-sex-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sex-input.component.html',
  styleUrl: './sex-input.component.scss',
})
export class SexInputComponent {
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() sexOptions: readonly string[] = [];

  public showDropdown = false;

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public getSelectedSexes() {
    return this.formGroup.value.sex
      .map((checked: boolean, i: number) =>
        checked ? this.sexOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public closeSexMenu() {
    this.showDropdown = false;
  }
}
