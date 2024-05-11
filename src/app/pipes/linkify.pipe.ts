// src/app/linkify.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
  standalone: true,
})
export class LinkifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string): any {
    if (!text) return text;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const instagramRegex = /@([a-zA-Z0-9._]+)/g;

    const replacedText = text
      .replace(
        urlRegex,
        '<a href="$1" target="_blank" class="animal-data-link">$1</a>'
      )
      .replace(
        instagramRegex,
        '<a href="https://www.instagram.com/$1" target="_blank" class="animal-data-link">@$1</a>'
      );

    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }
}
