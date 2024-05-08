import { Injectable } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { IOpenGraphTag } from "../interfaces/opengraph-tag.interface";

@Injectable({
  providedIn: 'root',
})

export class OpengraphService {
  constructor(private meta: Meta) {}

  public setTags(tags: IOpenGraphTag[]) {
    tags.forEach((tag: IOpenGraphTag) => {
      this.meta.addTag({property: tag.property, content: tag.content});
    })
  }
}
