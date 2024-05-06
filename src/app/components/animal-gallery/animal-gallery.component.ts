import { Component, OnInit } from '@angular/core';
import {
  AnimalSex,
  AnimalSize,
  IAnimal,
} from '../../interfaces/animal.interface';
import { AnimalCardComponent } from '../animal-card/animal-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-animal-gallery',
  standalone: true,
  imports: [AnimalCardComponent, FormsModule],
  templateUrl: './animal-gallery.component.html',
  styleUrl: './animal-gallery.component.scss',
})
export class AnimalGalleryComponent implements OnInit {
  private readonly animalsDatabase: IAnimal[] = [
    {
      id: '1',
      species: 'Cachorro',
      sex: 'macho',
      imageURLs: ['https://example.com/animal1.jpg'],
      characteristics: 'Cão dócil e amigável',
      size: 'médio',
      color: 'Marrom',
      hair: 'Curto',
      whereItIs: 'Abrigo de animais',
      foundOwner: false,
      contactInformation: 'Contato: (123) 456-7890',
      whereWasFound: 'Rua Principal',
      breed: 'Vira-lata',
    },
    {
      id: '2',
      species: 'Gato',
      sex: 'fêmea',
      imageURLs: ['https://example.com/animal2.jpg'],
      characteristics: 'Gato carinhoso e brincalhão',
      size: 'pequeno',
      color: 'Branco e preto',
      hair: 'Curto',
      whereItIs: 'Casa temporária',
      foundOwner: false,
      contactInformation: 'Contato: (987) 654-3210',
      whereWasFound: 'Praça Central',
      breed: 'Sem raça definida',
    },
    {
      id: '3',
      species: 'Cachorro',
      sex: 'não se sabe',
      imageURLs: ['https://example.com/animal3.jpg'],
      characteristics: 'Cão leal e protetor',
      size: 'grande',
      color: 'Preto',
      hair: 'Médio',
      whereItIs: 'Residência temporária',
      foundOwner: false,
      contactInformation: 'Contato: (555) 555-5555',
      whereWasFound: 'Margem do Rio',
      breed: 'Pastor Alemão',
    },
    {
      id: '4',
      species: 'Gato',
      sex: 'macho',
      imageURLs: ['https://example.com/animal4.jpg'],
      characteristics: 'Gato tranquilo e observador',
      size: 'pequeno',
      color: 'Cinza',
      hair: 'Longo',
      whereItIs: 'Casa de passagem',
      foundOwner: false,
      contactInformation: 'Contato: (111) 222-3333',
      whereWasFound: 'Área de Comércio',
      breed: 'Maine Coon',
    },
    {
      id: '5',
      species: 'Cachorro',
      sex: 'fêmea',
      imageURLs: ['https://example.com/animal5.jpg'],
      characteristics: 'Cão energético e brincalhão',
      size: 'médio',
      color: 'Branco e marrom',
      hair: 'Curto',
      whereItIs: 'Centro de adoção',
      foundOwner: false,
      contactInformation: 'Contato: (444) 444-4444',
      whereWasFound: 'Rua Alagada',
      breed: 'Golden Retriever',
    },
  ];

  public animals: IAnimal[] = [];

  public sizeOptions: AnimalSize[] = ['pequeno', 'médio', 'grande'];
  public sexOptions: AnimalSex[] = ['fêmea', 'macho', 'não se sabe'];
  public colorOptions: string[] = [];

  public selectedSize: string = '0';
  public selectedSex: string = '0';
  public selectedColor: string = '0';

  ngOnInit() {
    this.animals = this.animalsDatabase;
    this.colorOptions = this.getColorOptions();
    console.log('===> colorOptions', this.colorOptions);
  }

  private getColorOptions() {
    return this.animals.reduce((acc: string[], animal) => {
      if (!acc.includes(animal.color)) {
        acc.push(animal.color);
      }

      return acc;
    }, []);
  }

  public capitalizeFirstWord(phrase: string) {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  }

  public filterAnimals() {
    console.log(
      '===> filters',
      this.selectedSize,
      this.selectedSex,
      this.selectedColor
    );
    const shouldFilterSize = this.selectedSize !== '0';
    const shouldFilterSex = this.selectedSex !== '0';
    const shouldFilterColor = this.selectedColor !== '0';

    this.animals = this.animalsDatabase.filter((animal) => {
      if (shouldFilterSize && animal.size !== this.selectedSize) {
        return false;
      }

      if (shouldFilterColor && animal.color !== this.selectedColor) {
        return false;
      }

      if (shouldFilterSex && animal.sex !== this.selectedSex) {
        return false;
      }

      return true;
    });
  }
}
