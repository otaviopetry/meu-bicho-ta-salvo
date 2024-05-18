import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-desktop',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar-desktop.component.html',
  styleUrl: './navbar-desktop.component.scss',
})
export class NavbarDesktopComponent {}
