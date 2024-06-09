import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-other-platforms',
  standalone: true,
  imports: [MatGridListModule, MatCardModule],
  templateUrl: './other-platforms.component.html',
  styleUrl: './other-platforms.component.scss',
})
export class OtherPlatformsComponent {
  public otherPlatforms = [
    {
      name: 'SOS Pet RS',
      link: 'https://sospetrs.com.br',
    },
    {
      name: 'Pets RS',
      link: 'https://petsrs.com.br',
    },
    {
      name: 'Arca Animal',
      link: 'https://arcanimal.com.br',
    },
    {
      name: 'Encontre Seu Pet Canoas',
      link: 'https://encontreseupetcanoas.com',
    },
    {
      name: 'Pet Mapa',
      link: 'https://petmapa.com.br',
    },
    {
      name: 'Ache Seu Pet RS',
      link: 'https://acheseupetrs.com.br',
    },
    {
      name: 'Pet SOS',
      link: 'https://petsos.com.br',
    },
  ];
}
