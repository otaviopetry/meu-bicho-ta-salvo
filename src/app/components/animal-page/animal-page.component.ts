import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAnimal } from '../../interfaces/animal.interface';
import { AnimalsService } from '../../services/animals.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-animal-page',
  standalone: true,
  imports: [AsyncPipe, HttpClientModule],
  providers: [AnimalsService],
  templateUrl: './animal-page.component.html',
  styleUrl: './animal-page.component.scss',
})
export class AnimalPageComponent {
  public animal$!: Observable<IAnimal | undefined>;

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const animalId = params['id'];

      this.animal$ = this.animalsService.getAnimalById(animalId);
    });
  }
}
