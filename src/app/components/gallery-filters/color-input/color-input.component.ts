import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COLOR_OPTIONS } from '../../../constants/constants';
import { capitalizeFirstWord } from '../../../utils/label-functions';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnimalsService } from '../../../services/animals.service';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './color-input.component.html',
  styleUrl: './color-input.component.scss',
})
export class ColorInputComponent {
  public showDropdown = false;

  @Input() formGroup!: FormGroup;
  @Input() colorOptions: readonly string[] = [];
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

  constructor(private animalsService: AnimalsService) {
    this.animalsService.filterAnimals$.subscribe(() => {
      this.showDropdown = false;
    });
  }

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public closeColorMenu() {
    this.showDropdown = false;
    this.closeMenu.emit();
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public getSelectedColors() {
    return this.formGroup.value.color
      .map((checked: boolean, i: number) =>
        checked ? this.colorOptions[i] : null
      )
      .filter((value: string | null) => value !== null);
  }
}
