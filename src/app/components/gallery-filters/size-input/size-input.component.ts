import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  capitalizeFirstWord,
  getSizeWord,
} from '../../../utils/label-functions';
import { AnimalSize } from '../../../interfaces/animal.interface';

@Component({
  selector: 'app-size-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './size-input.component.html',
  styleUrl: './size-input.component.scss',
})
export class SizeInputComponent {
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() sizeOptions: readonly AnimalSize[] = [];

  public showDropdown = false;

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public getSelectedSizes() {
    return this.formGroup.value.size
      .map((checked: boolean, i: number) =>
        checked ? this.sizeOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public closeSizeMenu() {
    this.showDropdown = false;
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }
}
