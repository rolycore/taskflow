import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskPayload } from '../models';

/** Acceso a la API de tareas (CRUD). */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/tareas`;

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  create(data: TaskPayload): Observable<Task> {
    return this.http.post<Task>(this.url, data);
  }

  update(id: number, data: TaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
