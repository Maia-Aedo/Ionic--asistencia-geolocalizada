import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, ref, uploadString, getStorage } from 'firebase/storage';
import { addDoc, collection, Firestore, GeoPoint } from '@angular/fire/firestore';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
  standalone: false
})

export class AsistenciaPage {
  capturedImage: string | null = null;
  mensaje = '';

  zonaValida = {
    lat: -34.6037,
    lng: -58.3816
  };

  radio = 100;

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  async registrarAsistencia(tipo: 'entrada' | 'salida') {
    try {
      const posicion = await Geolocation.getCurrentPosition();
      const ubicacion = {
        lat: posicion.coords.latitude,
        lng: posicion.coords.longitude,
      };

      const distancia = this.calcularDistancia(
        ubicacion.lat,
        ubicacion.lng,
        this.zonaValida.lat,
        this.zonaValida.lng
      );

      if (distancia > this.radio) {
        this.mensaje = 'Estás fuera de la zona permitida.';
        return;
      }

      const photo = await Camera.getPhoto({
        quality: 70,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        saveToGallery: false,
      });

      this.capturedImage = 'data:image/jpeg;base64,' + photo.base64String;

      const user = await this.authService.getCurrentUser();
      if (!user) {
        this.mensaje = 'Usuario no autenticado.';
        return;
      }

      const storage = getStorage();
      const filePath = `asistencias/${user.uid}/${tipo}_${new Date().getTime()}.jpeg`;
      const storageRef = ref(storage, filePath);

      await uploadString(storageRef, photo.base64String!, 'base64', {
        contentType: 'image/jpeg',
      });

      const urlFoto = await getDownloadURL(storageRef);

      await addDoc(collection(this.firestore, 'asistencias'), {
        uid: user.uid,
        tipo,
        hora: new Date(),
        ubicacion: new GeoPoint(ubicacion.lat, ubicacion.lng),
        fotoUrl: urlFoto,
      });

      this.mensaje = `¡${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada exitosamente!`;
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      this.mensaje = 'Error al registrar la asistencia.';
    }
  }

  // Calcula distancia en mt entre dos puntos geográficos (Haversine)
  calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // radio de la tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
