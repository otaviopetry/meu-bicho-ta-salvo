import { AnimalSize } from '../interfaces/animal.interface';

export function getSizeWord(sizeOption: AnimalSize) {
  return {
    ['pp']: 'Mini',
    ['p']: 'Pequeno',
    ['m']: 'Médio',
    ['g']: 'Grande',
    ['gg']: 'Enorme',
    ['não se sabe']: 'Não se sabe',
  }[sizeOption];
}

export function capitalizeFirstWord(phrase: string) {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}
