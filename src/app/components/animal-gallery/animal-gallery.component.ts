import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IAnimal } from '../../interfaces/animal.interface';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { FormsModule } from '@angular/forms';
import { AnimalsService } from '../../services/animals.service';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
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

  private subscriptions: Subscription[] = [];

  constructor(private animalsService: AnimalsService) {
    //
  }

  ngOnInit() {
    this.subscriptions.push(
      this.animalsService.filterAnimals$.subscribe(() => {
        this.animals = [];
      }),
      this.animalsService.resetFilters$.subscribe(() => {
        this.animals = [];
      }),
      this.animalsService.getAnimals().subscribe({
        next: (animals) => {
          this.animals = animals;
          this.loading = false;
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 &&
      !this.loading &&
      this.animalsService.hasMorePages &&
      this.animals.length > this.animalsService.itemsPerPage - 1
    ) {
      this.loading = true;
      this.animalsService.loadNextPage();

      setTimeout(() => {
        this.loading = false;
      }, 600);
    }

    if (this.scrollToTopBtn && this.scrollToTopBtn.nativeElement) {
      this.handleScrollToTopBtnVisibility();
    }
  }

  private handleScrollToTopBtnVisibility(): void {
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
