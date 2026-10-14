import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssueService } from '../../core/issue.service';
import { errorMessage } from '../../core/error.util';
import { Issue, IssueStatus } from '../../models';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="page-header">
      <div>
        <h1>Solución de problemas</h1>
        <p class="muted">Registra los problemas que encuentres y documenta cómo los resolviste.</p>
      </div>
      <button class="btn btn-primary" (click)="openCreate()">+ Reportar problema</button>
    </div>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    @if (loading()) {
      <p class="muted center">Cargando...</p>
    } @else if (issues().length === 0) {
      <div class="empty card">
        <p>Aún no has reportado problemas.</p>
        <button class="btn btn-primary" (click)="openCreate()">Reportar el primero</button>
      </div>
    } @else {
      <div class="list">
        @for (i of issues(); track i.id) {
          <article class="card issue">
            <div class="task-top">
              <span class="badge st-{{ i.estado }}">{{ i.estado === 'ABIERTO' ? 'Abierto' : 'Resuelto' }}</span>
              <small class="muted">{{ i.createdAt | date: 'dd/MM/yyyy HH:mm' }}</small>
            </div>
            <h3>{{ i.titulo }}</h3>
            <p>{{ i.descripcion }}</p>
            @if (i.solucion) {
              <div class="solution">
                <strong>Solución:</strong>
                <p>{{ i.solucion }}</p>
              </div>
            }
            <div class="task-actions">
              <button class="btn btn-ghost btn-sm" (click)="openEdit(i)">Editar</button>
              <button class="btn btn-danger btn-sm" (click)="remove(i)">Eliminar</button>
            </div>
          </article>
        }
      </div>
    }

    @if (showForm()) {
      <div class="modal-backdrop" (click)="closeForm()">
        <div class="modal card" (click)="$event.stopPropagation()">
          <h2>{{ editingId() ? 'Editar problema' : 'Reportar problema' }}</h2>
          <form [formGroup]="form" (ngSubmit)="save()" novalidate>
            <label class="field">
              <span>Título</span>
              <input type="text" formControlName="titulo" maxlength="150" />
              @if (form.controls.titulo.invalid && form.controls.titulo.touched) {
                <small class="error">El título es obligatorio.</small>
              }
            </label>

            <label class="field">
              <span>Descripción del problema</span>
              <textarea rows="3" formControlName="descripcion" maxlength="1500"></textarea>
              @if (form.controls.descripcion.invalid && form.controls.descripcion.touched) {
                <small class="error">La descripción es obligatoria.</small>
              }
            </label>

            <label class="field">
              <span>Solución (opcional)</span>
              <textarea rows="3" formControlName="solucion" maxlength="1500"></textarea>
            </label>

            <label class="field">
              <span>Estado</span>
              <select formControlName="estado">
                <option value="ABIERTO">Abierto</option>
                <option value="RESUELTO">Resuelto</option>
              </select>
            </label>

            @if (formError()) {
              <div class="alert alert-error">{{ formError() }}</div>
            }

            <div class="modal-actions">
              <button type="button" class="btn btn-ghost" (click)="closeForm()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving()">
                {{ saving() ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class IssuesComponent implements OnInit {
  private readonly issueService = inject(IssueService);
  private readonly fb = inject(FormBuilder);

  protected readonly issues = signal<Issue[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  protected readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', [Validators.required, Validators.maxLength(1500)]],
    solucion: [''],
    estado: ['ABIERTO' as IssueStatus],
  });

  ngOnInit(): void {
    this.load();
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ titulo: '', descripcion: '', solucion: '', estado: 'ABIERTO' });
    this.formError.set('');
    this.showForm.set(true);
  }

  protected openEdit(i: Issue): void {
    this.editingId.set(i.id);
    this.form.reset({
      titulo: i.titulo,
      descripcion: i.descripcion,
      solucion: i.solucion ?? '',
      estado: i.estado,
    });
    this.formError.set('');
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload = {
      titulo: v.titulo,
      descripcion: v.descripcion,
      solucion: v.solucion || null,
      estado: v.estado,
    };
    const id = this.editingId();
    const request = id ? this.issueService.update(id, payload) : this.issueService.create(payload);

    this.saving.set(true);
    this.formError.set('');
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.load();
      },
      error: (e) => {
        this.saving.set(false);
        this.formError.set(errorMessage(e));
      },
    });
  }

  protected remove(i: Issue): void {
    if (!confirm(`¿Eliminar el problema "${i.titulo}"?`)) return;
    this.issueService.remove(i.id).subscribe({
      next: () => this.issues.update((list) => list.filter((x) => x.id !== i.id)),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.issueService.list().subscribe({
      next: (list) => {
        this.issues.set(list);
        this.loading.set(false);
        this.error.set('');
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.loading.set(false);
      },
    });
  }
}
