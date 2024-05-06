import { Routes } from '@angular/router';
import { AnimalGalleryComponent } from './components/animal-gallery/animal-gallery.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'animais',
    pathMatch: 'full',
  },
  {
    path: 'animais',
    component: AnimalGalleryComponent,
  },
];
