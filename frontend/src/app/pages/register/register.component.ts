import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error.util';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-card card">
      <h1>Crea tu cuenta</h1>
      <p class="muted">Regístrate para empezar a organizar tus tareas.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label class="field">
          <span>Nombre</span>
          <input type="text" formControlName="nombre" placeholder="Tu nombre" autocomplete="name" />
          @if (invalid('nombre')) {
            <small class="error">El nombre es obligatorio.</small>
          }
        </label>

        <label class="field">
          <span>Correo electrónico</span>
          <input type="email" formControlName="email" placeholder="tu@correo.com" autocomplete="email" />
          @if (invalid('email')) {
            <small class="error">Ingresa un correo válido.</small>
          }
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input type="password" formControlName="password" autocomplete="new-password" />
          @if (invalid('password')) {
            <small class="error">Mínimo 6 caracteres.</small>
          }
        </label>

        @if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        }

        <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()">
          {{ loading() ? 'Creando cuenta...' : 'Registrarme' }}
        </button>
      </form>

      <p class="auth-footer">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
    </section>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected invalid(name: 'nombre' | 'email' | 'password'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/tareas']),
      error: (e) => {
        this.error.set(errorMessage(e));
        this.loading.set(false);
      },
    });
  }
}
