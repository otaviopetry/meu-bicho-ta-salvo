import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnimalSize, IAnimal } from '../../interfaces/animal.interface';
import { AnimalsService } from '../../services/animals.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { FirebaseService } from '../../services/firebase.service';
import { OpengraphService } from '../../services/opengraph.service';

@Component({
  selector: 'app-animal-page',
  standalone: true,
  imports: [AsyncPipe, RouterModule, HttpClientModule],
  providers: [AnimalsService, FirebaseService],
  templateUrl: './animal-page.component.html',
  styleUrl: './animal-page.component.scss',
})
export class AnimalPageComponent {
  public animal$!: Observable<IAnimal | undefined>;

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    private router: Router,
    private opengraphService: OpengraphService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const animalId = params['id'];

      this.animal$ = this.animalsService.getAnimalById(animalId).pipe(
        tap(animal => {
          if (animal) {
            this.opengraphService.setTags([
              { property: 'og:url', content: 'https://meu-bicho-ta-salvo.netlify.app/' },
              { property: 'og:title', content: 'Meu Bicho Tá Salvo - POA' },
              { property: 'og:image', content: animal.imageURLs[0] },
              { property: 'og:description',
                content: `${this.capitalizeFirstWord(animal.species)}, porte ${this.getSizeWord(animal.size).toLowerCase()}` }
            ]);
          }
        })
      );
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
