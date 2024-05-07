import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnimalSize, IAnimal } from '../../interfaces/animal.interface';
import { AnimalsService } from '../../services/animals.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';

@Component({
  selector: 'app-animal-page',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  providers: [AnimalsService],
  templateUrl: './animal-page.component.html',
  styleUrl: './animal-page.component.scss',
})
export class AnimalPageComponent {
  public animal$!: Observable<IAnimal | undefined>;

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const animalId = params['id'];

      this.animal$ = this.animalsService.getAnimalById(animalId);
    });
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public navigateToHome() {
    this.router.navigate(['animais']);
  }
}
