import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnimalSize, IAnimal } from '../../interfaces/animal.interface';
import { AnimalsService } from '../../services/animals.service';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { OpengraphService } from '../../services/opengraph.service';
import { LinkifyPipe } from '../../pipes/linkify.pipe';

@Component({
  selector: 'app-animal-page',
  standalone: true,
  imports: [AsyncPipe, RouterModule, LinkifyPipe],
  templateUrl: './animal-page.component.html',
  styleUrl: './animal-page.component.scss',
})
export class AnimalPageComponent {
  public animal$!: Observable<IAnimal | undefined>;

  showModal: boolean = false;
  currentImageIndex: number = 0;
  currentImageUrl: string = '';

  animalId = '';

  @ViewChild('scrollTarget') scrollTarget!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private animalsService: AnimalsService,
    private router: Router,
    private opengraphService: OpengraphService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const animalId = params['id'];
      this.animalId = animalId;

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

            setTimeout(() => {
              if (this.scrollTarget && this.scrollTarget.nativeElement) {
                this.scrollTarget.nativeElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }
            }, 200);
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

  public navigateBack() {
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

  formatTextareaText(text: string) {
    return this.capitalizeFirstWord(text.replace(/\n/g, '<br>'));
  }
}
