import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimalGalleryComponent } from './components/animal-gallery/animal-gallery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'meu-bicho-ta-salvo-poa';
}
