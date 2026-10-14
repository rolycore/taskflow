import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="navbar-inner container">
        <a class="brand" routerLink="/">
          <span class="brand-mark">✓</span> TaskFlow
        </a>

        @if (auth.isLoggedIn()) {
          <nav class="nav-links">
            <a routerLink="/tareas" routerLinkActive="active">Tareas</a>
            <a routerLink="/problemas" routerLinkActive="active">Problemas</a>
          </nav>
          <div class="nav-user">
            <span class="user-name">{{ auth.user()?.nombre }}</span>
            <button class="btn btn-ghost btn-sm" (click)="auth.logout()">Salir</button>
          </div>
        } @else {
          <nav class="nav-links">
            <a routerLink="/login" routerLinkActive="active">Iniciar sesión</a>
            <a routerLink="/registro" routerLinkActive="active">Registrarse</a>
          </nav>
        }
      </div>
    </header>

    <main class="container page">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
}
