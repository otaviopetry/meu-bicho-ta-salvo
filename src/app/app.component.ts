import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AnimalsService } from './services/animals.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserType } from './types/user-type.type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  providers: [AnimalsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public userType: UserType = 'tutor';
  public animalCount$ = this.animalsService.animalCount$.asObservable();

  private subscriptions: Subscription[] = [];

  constructor(
    private animalsService: AnimalsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    //
  }

  ngOnInit() {
    this.animalsService.loadLocations();
    this.animalsService.loadTemporaryHomeLocations();
    this.animalsService.loadAnimalCount();
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        if (params['abrigo']) {
          this.changeUserType('shelter');
          this.animalsService.handleShelterDirectAccess(params['abrigo']);
        } else {
          this.animalsService.loadInitialData();
        }
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
    return this.router.url.endsWith('animais');
  }

  public getHeaderPadding() {
    if (this.isHome()) {
      return 'pb-24';
    }

    return 'pb-16';
  }

  public changeUserType(userType: UserType) {
    this.animalsService.changeUserType(userType);
    this.userType = userType;
  }

  public navigateToHowToUse() {
    this.router.navigate(['/como-utilizar']);
  }
}
