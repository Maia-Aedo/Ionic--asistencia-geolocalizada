import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, Timestamp } from '@angular/fire/firestore';
import { Asistencia } from '../shared/interfaces/asistencia.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {

  // Ubicación permitida (casa)
  private UBICACION_PERMITIDA = {
    lat: -38.928539957761096,
    lng: -67.99830691704018,
    // Radio de aceptación en metros
    radioMetros: 300,
  };

  constructor(private firestore: Firestore) { }

  // Método para tomar la foto
  async tomarFoto(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64, // Guardamos como Base64
        source: CameraSource.Camera,
        promptLabelHeader: 'Tomar Foto',
        promptLabelCancel: 'Cancelar',
        promptLabelPhoto: 'Elegir de galería',
        promptLabelPicture: 'Tomar foto'
      });

      return `data:image/jpeg;base64,${image.base64String}`;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      throw new Error('No se pudo capturar la imagen');
    }
  }

  async validarUbicacion(): Promise<boolean> {
    try {
      const position = await Geolocation.getCurrentPosition({
        // Usar GPS si está disponible
        enableHighAccuracy: true,
        // Máximo tiempo de espera
        timeout: 5000
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const distancia = this.calcularDistancia(
        userLat, userLng,
        this.UBICACION_PERMITIDA.lat,
        this.UBICACION_PERMITIDA.lng
      );

      return distancia <= this.UBICACION_PERMITIDA.radioMetros;

    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      return false;
    }
  }

  // Fórmula Haversine para calcular distancia
  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Radio de la Tierra en metros
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  // Método para registrar asistencia
  registrarAsistencia(asistencia: Asistencia) {
    const ref = collection(this.firestore, 'asistencias');
    return addDoc(ref, {
      ...asistencia,
      timestamp: Timestamp.fromDate(asistencia.timestamp),
    });
  }

  // Método para obtener asistencias por usuario
  async obtenerAsistenciasPorUsuario(userId: string): Promise<Asistencia[]> {
    const ref = collection(this.firestore, 'asistencias');
    const q = query(ref, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data() as Asistencia;
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : data.timestamp
      };
    });
  }
}