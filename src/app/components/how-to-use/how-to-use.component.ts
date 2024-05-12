import { Component } from '@angular/core';

@Component({
  selector: 'app-how-to-use',
  standalone: true,
  imports: [],
  templateUrl: './how-to-use.component.html',
  styleUrl: './how-to-use.component.scss',
})
export class HowToUseComponent {
  videoUrl = 'https://meubichotasalvo.s3.amazonaws.com/como-utilizar.mp4';
}
