import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async login(form: NgForm) {
    if (!form.valid) return;
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();
    try {
      await this.authService.login(this.credentials.email, this.credentials.password);
      loading.dismiss();
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      loading.dismiss();
      const toast = await this.toastCtrl.create({ message: 'Error de login', duration: 2000, color: 'danger' });
      toast.present();
    }
  }

  // Redirije a registro
  registrarme() {
    this.navCtrl.navigateForward('/register');
  }
}
