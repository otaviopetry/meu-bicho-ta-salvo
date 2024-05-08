export type OGProperty = 'og:title' | 'og:image' | 'og:description';

export interface IOpenGraphTag {
  property: OGProperty;
  content: string;
}
