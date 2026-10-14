import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../core/task.service';
import { errorMessage } from '../../core/error.util';
import { Task, TaskPriority, TaskStatus } from '../../models';

type Filter = 'TODAS' | TaskStatus;

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="page-header">
      <div>
        <h1>Mis tareas</h1>
        <p class="muted">Organiza, prioriza y completa tu trabajo.</p>
      </div>
      <button class="btn btn-primary" (click)="openCreate()">+ Nueva tarea</button>
    </div>

    <div class="stats">
      <div class="stat card"><strong>{{ tasks().length }}</strong><span>Total</span></div>
      <div class="stat card"><strong>{{ count('PENDIENTE') }}</strong><span>Pendientes</span></div>
      <div class="stat card"><strong>{{ count('EN_PROGRESO') }}</strong><span>En progreso</span></div>
      <div class="stat card"><strong>{{ count('COMPLETADA') }}</strong><span>Completadas</span></div>
    </div>

    <div class="tabs" role="tablist">
      @for (f of filters; track f.value) {
        <button class="tab" [class.active]="filter() === f.value" (click)="filter.set(f.value)">
          {{ f.label }}
        </button>
      }
    </div>

    @if (error()) {
      <div class="alert alert-error">{{ error() }}</div>
    }

    @if (loading()) {
      <p class="muted center">Cargando tareas...</p>
    } @else if (visible().length === 0) {
      <div class="empty card">
        <p>No hay tareas {{ filter() === 'TODAS' ? 'todavía' : 'en este estado' }}.</p>
        @if (filter() === 'TODAS') {
          <button class="btn btn-primary" (click)="openCreate()">Crear la primera</button>
        }
      </div>
    } @else {
      <div class="grid">
        @for (t of visible(); track t.id) {
          <article class="card task" [class.done]="t.estado === 'COMPLETADA'">
            <div class="task-top">
              <span class="badge prio-{{ t.prioridad }}">{{ priorityLabel(t.prioridad) }}</span>
              <span class="badge st-{{ t.estado }}">{{ statusLabel(t.estado) }}</span>
            </div>
            <h3>{{ t.titulo }}</h3>
            @if (t.descripcion) {
              <p class="muted">{{ t.descripcion }}</p>
            }
            @if (t.fechaLimite) {
              <p class="due" [class.overdue]="isOverdue(t)">
                📅 {{ t.fechaLimite | date: 'dd/MM/yyyy' }}
              </p>
            }
            <div class="task-actions">
              <button class="btn btn-ghost btn-sm" (click)="openEdit(t)">Editar</button>
              <button class="btn btn-danger btn-sm" (click)="remove(t)">Eliminar</button>
            </div>
          </article>
        }
      </div>
    }

    @if (showForm()) {
      <div class="modal-backdrop" (click)="closeForm()">
        <div class="modal card" (click)="$event.stopPropagation()">
          <h2>{{ editingId() ? 'Editar tarea' : 'Nueva tarea' }}</h2>
          <form [formGroup]="form" (ngSubmit)="save()" novalidate>
            <label class="field">
              <span>Título</span>
              <input type="text" formControlName="titulo" maxlength="150" />
              @if (form.controls.titulo.invalid && form.controls.titulo.touched) {
                <small class="error">El título es obligatorio.</small>
              }
            </label>

            <label class="field">
              <span>Descripción</span>
              <textarea rows="3" formControlName="descripcion" maxlength="1000"></textarea>
            </label>

            <div class="row">
              <label class="field">
                <span>Estado</span>
                <select formControlName="estado">
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROGRESO">En progreso</option>
                  <option value="COMPLETADA">Completada</option>
                </select>
              </label>
              <label class="field">
                <span>Prioridad</span>
                <select formControlName="prioridad">
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </label>
            </div>

            <label class="field">
              <span>Fecha límite</span>
              <input type="date" formControlName="fechaLimite" />
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
export class TasksComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly fb = inject(FormBuilder);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly filter = signal<Filter>('TODAS');
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'TODAS', label: 'Todas' },
    { value: 'PENDIENTE', label: 'Pendientes' },
    { value: 'EN_PROGRESO', label: 'En progreso' },
    { value: 'COMPLETADA', label: 'Completadas' },
  ];

  protected readonly visible = computed(() => {
    const f = this.filter();
    return f === 'TODAS' ? this.tasks() : this.tasks().filter((t) => t.estado === f);
  });

  protected readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: [''],
    estado: ['PENDIENTE' as TaskStatus],
    prioridad: ['MEDIA' as TaskPriority],
    fechaLimite: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  protected count(status: TaskStatus): number {
    return this.tasks().filter((t) => t.estado === status).length;
  }

  protected statusLabel(s: TaskStatus): string {
    return { PENDIENTE: 'Pendiente', EN_PROGRESO: 'En progreso', COMPLETADA: 'Completada' }[s];
  }

  protected priorityLabel(p: TaskPriority): string {
    return { BAJA: 'Baja', MEDIA: 'Media', ALTA: 'Alta' }[p];
  }

  protected isOverdue(t: Task): boolean {
    if (!t.fechaLimite || t.estado === 'COMPLETADA') return false;
    const today = new Date().toISOString().slice(0, 10);
    return t.fechaLimite < today;
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ titulo: '', descripcion: '', estado: 'PENDIENTE', prioridad: 'MEDIA', fechaLimite: '' });
    this.formError.set('');
    this.showForm.set(true);
  }

  protected openEdit(t: Task): void {
    this.editingId.set(t.id);
    this.form.reset({
      titulo: t.titulo,
      descripcion: t.descripcion ?? '',
      estado: t.estado,
      prioridad: t.prioridad,
      fechaLimite: t.fechaLimite ?? '',
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
      descripcion: v.descripcion || null,
      estado: v.estado,
      prioridad: v.prioridad,
      fechaLimite: v.fechaLimite || null,
    };
    const id = this.editingId();
    const request = id ? this.taskService.update(id, payload) : this.taskService.create(payload);

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

  protected remove(t: Task): void {
    if (!confirm(`¿Eliminar la tarea "${t.titulo}"?`)) return;
    this.taskService.remove(t.id).subscribe({
      next: () => this.tasks.update((list) => list.filter((x) => x.id !== t.id)),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.taskService.list().subscribe({
      next: (list) => {
        this.tasks.set(list);
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
