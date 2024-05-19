import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { IAnimal } from '../../interfaces/animal.interface';
import { HappyReunionsService } from '../../services/happy-reunions.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-happy-reunions',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimalCardComponent, HttpClientModule],
  templateUrl: './happy-reunions.component.html',
  styleUrl: './happy-reunions.component.scss',
})
export class HappyReunionsComponent {
  public animals: IAnimal[] = [];
  public loading$ = this.happyReunionsService.loading$.asObservable();
  public loading = false;

  private subscriptions: Subscription[] = [];

  @ViewChild('scrollToTopBtn') scrollToTopBtn!: ElementRef<HTMLButtonElement>;

  constructor(private happyReunionsService: HappyReunionsService) {
    this.loading = true;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.happyReunionsService.getAnimals().subscribe({
        next: (animals) => {
          console.log('===> animals', animals);
          this.animals = animals;
          this.loading = false;
        },
      })
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 &&
      !this.loading &&
      this.happyReunionsService.hasMorePages &&
      this.animals.length > this.happyReunionsService.itemsPerPage - 1
    ) {
      this.loading = true;
      this.happyReunionsService.loadNextPage();

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

  public scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
