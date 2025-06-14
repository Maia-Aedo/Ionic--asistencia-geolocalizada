import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AuthService } from 'src/app/services/auth.service';
import { Asistencia } from '../../shared/interfaces/asistencia.interface'

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: false
})

export class HistorialPage implements OnInit {
  registros: Asistencia[] = [];
  userId: string | null = null;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private asistenciaService: AsistenciaService
  ) { }

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (!user) {
      this.navCtrl.navigateRoot('/login');
      return;
    }

    this.userId = user.uid;
    this.cargarHistorial();
  }

  async cargarHistorial() {
    if (!this.userId) return;
    try {
      const data = await this.asistenciaService.obtenerAsistenciasPorUsuario(this.userId);
      this.registros = data;
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  }

  irAHome() {
    this.navCtrl.navigateRoot('/home');
  }

}
