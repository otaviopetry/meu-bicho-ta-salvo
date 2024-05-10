import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimalsService } from './services/animals.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  providers: [AnimalsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private animalsService: AnimalsService) {
    //
  }

  ngOnInit() {
    this.animalsService.loadInitialData();
    this.animalsService.loadLocations();
  }
}
