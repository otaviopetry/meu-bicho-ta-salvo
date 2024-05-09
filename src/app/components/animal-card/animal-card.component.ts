import { Component, Input } from '@angular/core';
import { AnimalSize, IAnimal } from '../../interfaces/animal.interface';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.scss',
})
export class AnimalCardComponent {
  @Input() animal!: IAnimal;

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }

  public capitalizePhrase(phrase: string) {
    return capitalizeFirstWord(phrase);
  }
}
