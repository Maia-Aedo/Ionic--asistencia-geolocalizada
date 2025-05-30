import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { addDoc, collection, Firestore, GeoPoint } from '@angular/fire/firestore';
import { FirebaseStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage {
  capturedImage: string | null = null;
  mensaje = '';

  //! Definimos la zona 'permitida'
  zonaValida = {
    lat: -34.6037,
    lng: -58.3816
  };
  //! Tolerancia en metros
  radio = 100;

  constructor(
    private firestore: Firestore,
    private storage: FirebaseStorage,
    private authService: AuthService
  ) { }

  async registrarAsistencia(tipo: 'entrada' | 'salida') {
    try {
      // Obtenemos la ubicación actual con latitud y longitud
      const posicion = await Geolocation.getCurrentPosition();
      const ubicacion = {
        lat: posicion.coords.latitude,
        lng: posicion.coords.longitude,
      };

      // Verificamos que la distancia concuerde
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

      //! FOTO
      const photo = await Camera.getPhoto({
        quality: 70,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        // que no se guarde
        saveToGallery: false,
      });

      this.capturedImage = 'data:image/jpeg;base64,' + photo.base64String;

      // Guardar la foto en storage
      const user = await this.authService.getCurrentUser();
      if (!user) {
        this.mensaje = 'Usuario no autenticado.';
        return;
      }

      const filePath = `asistencias/${user.uid}/${tipo}_${new Date().getTime()}.jpeg`;
      const storageRef = ref(this.storage, filePath);

      await uploadString(storageRef, photo.base64String!, 'base64', {
        contentType: 'image/jpeg/png/jpg',
      });

      const urlFoto = await getDownloadURL(storageRef);

      // Guardar en la colección usando geoPoint (almacena ubi)
      await addDoc(collection(this.firestore, 'asistencias'), {
        uid: user.uid,
        tipo: tipo,
        hora: new Date(),
        ubicacion: new GeoPoint(ubicacion.lat, ubicacion.lng),
        fotoUrl: urlFoto,
      });

      // Mensaje de éxito
      this.mensaje = `¡${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada exitosamente!`;
      // Mensaje de error
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      this.mensaje = 'Error al registrar la asistencia.';
    }
  }

}
