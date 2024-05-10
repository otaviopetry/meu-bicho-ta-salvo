import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnimalSize, IAnimal } from '../../interfaces/animal.interface';
import { AnimalsService } from '../../services/animals.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { OpengraphService } from '../../services/opengraph.service';

@Component({
  selector: 'app-animal-page',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  templateUrl: './animal-page.component.html',
  styleUrl: './animal-page.component.scss',
})
export class AnimalPageComponent {
  public animal$!: Observable<IAnimal | undefined>;

  showModal: boolean = false;
  currentImageIndex: number = 0;
  currentImageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    private router: Router,
    private opengraphService: OpengraphService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const animalId = params['id'];

      this.animal$ = this.animalsService.getAnimalById(animalId).pipe(
        tap((animal) => {
          if (animal) {
            this.opengraphService.setTags([
              {
                property: 'og:url',
                content: 'https://meu-bicho-ta-salvo.netlify.app/',
              },
              { property: 'og:title', content: 'Meu Bicho Tá Salvo - POA' },
              { property: 'og:image', content: animal.imageURLs[0] },
              {
                property: 'og:description',
                content: `${this.capitalizeFirstWord(
                  animal.species
                )}, porte ${this.getSizeWord(animal.size)?.toLowerCase()}`,
              },
            ]);
          }
        })
      );
    });

    window.scrollTo(0, 0);
  }

  public getSizeWord(sizeOption: AnimalSize) {
    return getSizeWord(sizeOption);
  }

  public capitalizeFirstWord(phrase: string) {
    return capitalizeFirstWord(phrase);
  }

  public navigateBack() {
    // go back using the window object
    window.history.back();
  }

  openModal(index: number, imageURLs: string[]): void {
    this.currentImageIndex = index;
    this.currentImageUrl = imageURLs[index];
    this.showModal = true;
  }

  changeImage(step: number, imageURLs: string[]): void {
    this.currentImageIndex += step;

    if (this.currentImageIndex >= imageURLs.length) {
      this.currentImageIndex = 0; // Loop back to the first image
    }
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = imageURLs.length - 1; // Loop to the last image
    }

    this.currentImageUrl = imageURLs[this.currentImageIndex];
  }

  closeModal(): void {
    this.showModal = false;
  }
}
