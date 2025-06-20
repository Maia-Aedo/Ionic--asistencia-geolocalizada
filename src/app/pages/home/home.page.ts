import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AuthService } from 'src/app/services/auth.service';
import { Asistencia } from '../../shared/interfaces/asistencia.interface';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  mensajeExito = false;

  constructor(
    private navCtrl: NavController,
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private ngZone: NgZone
  ) { }

  // async registrarAsistencia(tipo: 'entrada' | 'salida') {
  //   const permitido = await this.asistenciaService.validarUbicacion();
  //   if (!permitido) {
  //     this.mostrarToast('No estás dentro del área permitida', 'danger');
  //     return;
  //   }

  //   try {
  //     // Toma foto
  //     const fotoBase64 = await this.asistenciaService.tomarFoto();

  //     // Obtiene el user
  //     const user = await this.authService.getCurrentUser();
  //     if (!user) throw new Error('Usuario no autenticado');

  //     // Registramos la ubicación actual
  //     const position = await Geolocation.getCurrentPosition();
  //     const ubicacion = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };

  //     // Creamos obj de asistencia(interface)
  //     const nuevaAsistencia: Asistencia = {
  //       userId: user.uid,
  //       tipo,
  //       timestamp: new Date(),
  //       ubicacion,
  //       foto: fotoBase64 // Guardamos la foto
  //     };

  //     // Registrar en Firestore
  //     await this.asistenciaService.registrarAsistencia(nuevaAsistencia);
  //     this.mensajeExito = true;
  //     this.mostrarToast('✅ Asistencia registrada con éxito', 'success');

  //   } catch (error: any) {
  //     console.error('Error al registrar asistencia:', error);
  //     this.mostrarToast(`Hubo un problema: ${error.message || 'Inténtalo más tarde'}`, 'danger');
  //   }
  // }

  async registrarAsistencia(tipo: 'entrada' | 'salida') {
    this.ngZone.run(async () => {
      const permitido = await this.asistenciaService.validarUbicacion();
      if (!permitido) {
        this.mostrarToast('No estás dentro del área permitida', 'danger');
        return;
      }

      try {
        const fotoBase64 = await this.asistenciaService.tomarFoto();

        const user = await this.authService.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const position = await Geolocation.getCurrentPosition();
        const ubicacion = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const nuevaAsistencia: Asistencia = {
          userId: user.uid,
          tipo,
          timestamp: new Date(),
          ubicacion,
          foto: fotoBase64
        };
        

        await this.asistenciaService.registrarAsistencia(nuevaAsistencia);
        this.mensajeExito = true;
        this.mostrarToast('✅ Asistencia registrada con éxito', 'success');

      } catch (error: any) {
        console.error('Error al registrar asistencia:', error);
        this.mostrarToast(`Hubo un problema: ${error.message || 'Inténtalo más tarde'}`, 'danger');
      }
    });
  }

  irAlHistorial() {
    this.navCtrl.navigateForward('/historial');
  }

  logout() {
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot('/login');
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}