import { HttpErrorResponse } from '@angular/common/http';

/** Obtiene un mensaje legible a partir de un error HTTP de la API. */
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que la API este activa.';
    }
    return error.error?.message ?? 'Ocurrio un error inesperado.';
  }
  return 'Ocurrio un error inesperado.';
}
