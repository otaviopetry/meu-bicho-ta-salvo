import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
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

  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(
    private animalsService: AnimalsService,
    private renderer: Renderer2
  ) {
    this.animalsService.filterAnimals$.subscribe(() => {
      this.showDropdown = false;
    });
    this.renderer.listen('window', 'click', (event: Event) => {
      if (
        this.dropdown &&
        this.dropdown.nativeElement &&
        !this.dropdown.nativeElement.contains(event.target)
      ) {
        this.showDropdown = false;
      }
    });
  }

  public toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  public closeColorMenu() {
    this.showDropdown = false;
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
