import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NavController,
    ToastController,
    LoadingController
  ]
})

export class RegisterPage {
  data = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async register(form: NgForm) {
    if (!form.valid || this.data.password !== this.data.confirmPassword) {
      const toast = await this.toastCtrl.create({ message: 'Revisa tus datos', duration: 2000, color: 'warning' });
      return toast.present();
    }

    const loading = await this.loadingCtrl.create({ message: 'Registrando usuario...' });
    await loading.present();
    try {
      await this.authService.register(this.data.email, this.data.password);
      loading.dismiss();
      const toast = await this.toastCtrl.create({ message: 'Registro exitoso', duration: 2000, color: 'success' });
      toast.present();
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      loading.dismiss();
      const toast = await this.toastCtrl.create({ message: 'Error al registrar', duration: 2000, color: 'danger' });
      toast.present();
    }
  }

  // Redirije a login
  loggear() {
    this.navCtrl.navigateBack('/login');
  }
}
