import { AnimalSex, AnimalSize } from '../interfaces/animal.interface';

export const COLOR_OPTIONS = Object.freeze([
  'bege',
  'bege e preto',
  'branco',
  'branco e bege',
  'branco e caramelo',
  'branco e marrom',
  'branco e preto',
  'branco e cinza',
  'branco, caramelo/marrom e preto',
  'caramelo e preto',
  'caramelo e cinza',
  'caramelo',
  'cinza',
  'cinza e preto',
  'marrom',
  'marrom e preto',
  'marrom e caramelo',
  'tigrado',
  'preto',
  'preto e branco',
  'laranja',
  'laranja com branco',
  'frajola',
  'tricolor',
  'tigrado com branco',
  'cinza com branco',
  'escaminha/tartaruguinha',
  'tipo "siamês"',
  'outras cores',
]);
export const SEX_OPTIONS: readonly AnimalSex[] = Object.freeze([
  'fêmea',
  'macho',
]);
export const SIZE_OPTIONS: readonly AnimalSize[] = Object.freeze([
  'p',
  'm',
  'g',
  'não se sabe',
]);
export const SPECIES_OPTIONS: readonly string[] = [
  'cachorro',
  'gato',
  'outros',
];
