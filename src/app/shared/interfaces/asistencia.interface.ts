export interface Asistencia {
  tipo: 'entrada' | 'salida';
  timestamp: Date;
  ubicacion?: {
    lat: number;
    lng: number;
  }
  foto: string;
  userId: string;
}

