import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnimalSize, IAnimal } from '../../interfaces/animal.interface';
import { AnimalsService } from '../../services/animals.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { FirebaseService } from '../../services/firebase.service';

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
