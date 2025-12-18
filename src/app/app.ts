import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu-component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MenuComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  showMenu: boolean = false;
  protected readonly title = signal('galleria-bank-web');
    constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !(event.url === '/login' || event.url === '/');
      }
    });
  }
}
