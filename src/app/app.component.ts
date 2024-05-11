import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AnimalsService } from './services/animals.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserType } from './types/user-type.type';

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

  constructor(private animalsService: AnimalsService, private router: Router) {
    //
  }

  ngOnInit() {
    this.animalsService.loadInitialData();
    this.animalsService.loadLocations();
    this.animalsService.loadAnimalCount();
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
}
