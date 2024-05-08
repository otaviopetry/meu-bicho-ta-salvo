export type OGProperty = 'og:title' | 'og:image' | 'og:description' | 'og:url';

export interface IOpenGraphTag {
  property: OGProperty;
  content: string;
}
