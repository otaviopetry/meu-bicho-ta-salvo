import { Routes } from '@angular/router';
import { AnimalGalleryComponent } from './components/animal-gallery/animal-gallery.component';
import { AnimalPageComponent } from './components/animal-page/animal-page.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';
import { HappyReunionsComponent } from './components/happy-reunions/happy-reunions.component';
import { OtherPlatformsComponent } from './components/other-platforms/other-platforms.component';

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
  {
    path: 'como-utilizar',
    component: HowToUseComponent,
  },
  {
    path: 'reencontros',
    component: HappyReunionsComponent,
  },
  {
    path: 'outras-plataformas',
    component: OtherPlatformsComponent,
  },
  {
    path: '**',
    redirectTo: 'animais',
  },
];
