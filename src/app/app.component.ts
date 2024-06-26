import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AnimalsService } from './services/animals.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserType } from './types/user-type.type';
import { Subscription } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HappyReunionsService } from './services/happy-reunions.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, NavbarComponent],
  providers: [AnimalsService, HappyReunionsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public userType: UserType = 'tutor';
  public animalCount$ = this.animalsService.animalCount$.asObservable();

  private subscriptions: Subscription[] = [];

  @ViewChild('mainContainer') mainContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private animalsService: AnimalsService,
    private happyReunionsService: HappyReunionsService,
    private router: Router
  ) {
    //
  }

  ngOnInit() {
    this.animalsService.loadLocations();
    this.animalsService.loadTemporaryHomeLocations();
    this.animalsService.loadAnimalCount();
    this.happyReunionsService.loadHappyReunitedAnimals();
    this.subscriptions.push(
      this.animalsService.userType$.subscribe((userType) => {
        this.userType = userType;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public navigateHome() {
    this.router.navigate(['/']);
  }

  public isHome() {
    return (
      this.router.url.endsWith('animais') ||
      this.router.url.includes('animais?')
    );
  }

  public isReunions() {
    return this.router.url.endsWith('reencontros');
  }

  public getHeaderPadding() {
    if (this.isHome()) {
      return 'pt-8 pb-20';
    }

    return 'py-8';
  }

  public changeUserType(userType: UserType) {
    this.animalsService.changeUserType(userType);
    this.userType = userType;
    this.scrollToMainContainer();
  }

  public navigateToHowToUse() {
    this.router.navigate(['/como-utilizar']);
  }

  private scrollToMainContainer() {
    const offset = 320;
    const menuElement = this.mainContainer.nativeElement;
    const elementPosition = menuElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    if (elementPosition > 2000) {
      return;
    }

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}
