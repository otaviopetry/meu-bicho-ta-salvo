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
