export type AnimalSize = 'pequeno' | 'médio' | 'grande';
export type AnimalSex = 'macho' | 'fêmea' | 'não se sabe';

export interface IAnimal {
  id: string;
  species: string;
  sex: AnimalSex;
  imageURLs: string[];
  characteristics: string;
  size: AnimalSize;
  color: string;
  hair: string;
  whereItIs: string;
  foundOwner: boolean;
  contactInformation: string;
  whereWasFound?: string;
  breed?: string;
}
