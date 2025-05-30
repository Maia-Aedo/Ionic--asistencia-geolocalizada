// src/app/models/asistencia.model.ts
export interface Asistencia {
  tipo: 'entrada' | 'salida';
  timestamp: Date;
  lat: number;
  lng: number;
  imagen: string;
  userId: string;
}

