import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AnimalSex,
  AnimalSize,
  IAnimal,
} from '../../interfaces/animal.interface';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { FormsModule } from '@angular/forms';
import { AnimalsService } from '../../services/animals.service';
import { take } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { capitalizeFirstWord, getSizeWord } from '../../utils/label-functions';
import { CommonModule } from '@angular/common';
import { GalleryFiltersComponent } from '../gallery-filters/gallery-filters.component';

@Component({
  selector: 'app-animal-gallery',
  standalone: true,
  imports: [
    AnimalCardComponent,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    GalleryFiltersComponent,
  ],
  templateUrl: './animal-gallery.component.html',
  styleUrl: './animal-gallery.component.scss',
})
export class AnimalGalleryComponent implements OnInit {
  public animals: IAnimal[] = [];
  public loading = false;
  public loading$ = this.animalsService.loading$.asObservable();

  @ViewChild('scrollToTopBtn') scrollToTopBtn!: ElementRef<HTMLButtonElement>;

  constructor(private animalsService: AnimalsService, private router: Router) {
    this.loading = true;
  }

  ngOnInit() {
    this.getAnimals();
  }

  private getAnimals() {
    this.animalsService.getAnimals().subscribe({
      next: (animals) => {
        this.animals = animals;
        this.loading = false;
      },
    });
  }

  public scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.loading &&
      this.animalsService.hasMorePages
    ) {
      this.loading = true;
      this.animalsService.loadNextPage();

      setTimeout(() => {
        this.loading = false;
      }, 600);
    }

    if (
      document.body.scrollTop > window.innerHeight ||
      document.documentElement.scrollTop > window.innerHeight
    ) {
      this.scrollToTopBtn.nativeElement.style.display = 'block';
    } else {
      this.scrollToTopBtn.nativeElement.style.display = 'none';
    }
  }
}
