import { Routes } from '@angular/router';
import { AnimalGalleryComponent } from './components/animal-gallery/animal-gallery.component';
import { AnimalPageComponent } from './components/animal-page/animal-page.component';

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
  {
    path: 'animais/:id',
    component: AnimalPageComponent,
  },
];
