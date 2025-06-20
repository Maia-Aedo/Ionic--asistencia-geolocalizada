import { Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Asistencia } from '../shared/interfaces/asistencia.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import firebase from 'firebase/compat/app';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {

  private ZONA_PERMITIDA = {
    lat: -38.928872768316914,
    lng: -67.99828000954875,
    radio: 600 // en metros
  };

  constructor(
    private firestore: AngularFirestore,
    private injector: EnvironmentInjector
  ) { }

  /**
   * Captura una foto desde la cámara del dispositivo
   */
  async tomarFoto(): Promise<string> {
    try {
      const imagen = await Camera.getPhoto({
        quality: 40,
        width: 800,
        height: 600,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      return `data:image/jpeg;base64,${imagen.base64String}`;
    } catch (err) {
      console.error('Error al capturar foto:', err);
      throw new Error('No se pudo capturar la imagen');
    }
  }

  /**
   * Verifica si el usuario está dentro de la zona válida
   */
  async validarUbicacion(): Promise<boolean> {
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000
      });
      const distancia = this.calcularDistancia(pos.coords.latitude, pos.coords.longitude);
      return distancia <= this.ZONA_PERMITIDA.radio;
    } catch (err) {
      console.error('Error obteniendo ubicación:', err);
      return false;
    }
  }

  /**
   * Registra una nueva asistencia en Firestore
   */
  async registrarAsistencia(asistencia: Asistencia): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      await this.firestore.collection('asistencias').add({
        tipo: asistencia.tipo,
        userId: asistencia.userId,
        foto: asistencia.foto,
        ubicacion: asistencia.ubicacion
          ? new firebase.firestore.GeoPoint(asistencia.ubicacion.lat, asistencia.ubicacion.lng)
          : null,
        timestamp: firebase.firestore.Timestamp.fromDate(asistencia.timestamp as Date),
      });
    });
  }

  /**
   * Retorna asistencias del usuario actual
   */
  async obtenerAsistenciasPorUsuario(userId: string): Promise<Asistencia[]> {
    return runInInjectionContext(this.injector, async () => {
      const ref = this.firestore.collection<Asistencia>('asistencias', ref =>
        ref.where('userId', '==', userId).orderBy('timestamp', 'desc')
      );
      const snapshot = await firstValueFrom(ref.snapshotChanges());
      return snapshot.map(doc => {
        const data = doc.payload.doc.data();
        return {
          id: doc.payload.doc.id,
          ...data,
          timestamp: data.timestamp instanceof firebase.firestore.Timestamp
            ? data.timestamp.toDate()
            : data.timestamp
        };
      });
    });
  }


  /**
   * Calcula distancia entre dos coordenadas usando la fórmula Haversine
   */
  private calcularDistancia(lat: number, lng: number): number {
    const R = 6371000; // Radio de la tierra en metros
    const φ1 = this.toRad(lat);
    const φ2 = this.toRad(this.ZONA_PERMITIDA.lat);
    const Δφ = this.toRad(this.ZONA_PERMITIDA.lat - lat);
    const Δλ = this.toRad(this.ZONA_PERMITIDA.lng - lng);

    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRad(grados: number): number {
    return grados * Math.PI / 180;
  }
}
