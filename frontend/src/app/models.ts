/** Modelos de datos que intercambia el frontend con la API. */

export type TaskStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
export type TaskPriority = 'BAJA' | 'MEDIA' | 'ALTA';
export type IssueStatus = 'ABIERTO' | 'RESUELTO';

export interface AuthResponse {
  token: string;
  nombre: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  nombre: string;
}

export interface TaskPayload {
  titulo: string;
  descripcion: string | null;
  estado: TaskStatus;
  prioridad: TaskPriority;
  fechaLimite: string | null;
}

export interface Task extends TaskPayload {
  id: number;
  createdAt: string;
}

export interface IssuePayload {
  titulo: string;
  descripcion: string;
  solucion: string | null;
  estado: IssueStatus;
}

export interface Issue extends IssuePayload {
  id: number;
  createdAt: string;
}
