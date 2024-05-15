import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { capitalizeFirstWord } from '../../../utils/label-functions';
import { AnimalsService } from '../../../services/animals.service';

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
