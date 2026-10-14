import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Issue, IssuePayload } from '../models';

/** Acceso a la API de problemas y soluciones (CRUD). */
@Injectable({ providedIn: 'root' })
export class IssueService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/problemas`;

  list(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.url);
  }

  create(data: IssuePayload): Observable<Issue> {
    return this.http.post<Issue>(this.url, data);
  }

  update(id: number, data: IssuePayload): Observable<Issue> {
    return this.http.put<Issue>(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
