import { Component, Input } from '@angular/core';
import { IAnimal } from '../interfaces/animal.interface';

@Component({
  selector: 'app-animal-card',
  standalone: true,
  imports: [],
  templateUrl: './animal-card.component.html',
  styleUrl: './animal-card.component.scss',
})
export class AnimalCardComponent {
  @Input() animal!: IAnimal;
}
