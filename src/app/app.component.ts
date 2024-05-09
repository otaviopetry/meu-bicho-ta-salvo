import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimalGalleryComponent } from './components/animal-gallery/animal-gallery.component';
import { AnimalsService } from './services/animals.service';
import { FirebaseService } from './services/firebase.service';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  providers: [AnimalsService, FirebaseService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'meu-bicho-ta-salvo-poa';
}
