import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {
  showPassword: boolean = false;

  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    public router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async login(form: NgForm) {
    if (!form.valid) return;

    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    try {
      const userCredential = await this.authService.login(this.credentials.email, this.credentials.password);

      localStorage.setItem('token', 'authenticated');
      localStorage.setItem('user', JSON.stringify(userCredential.user));

      loading.dismiss();
      this.router.navigateByUrl('/home');

    } catch (error: any) {
      loading.dismiss();

      let message = 'Error al iniciar sesión';

      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'Usuario no encontrado';
            break;
          case 'auth/wrong-password':
            message = 'Contraseña incorrecta';
            break;
          default:
            message = error.message || 'Error desconocido';
        }
      }

      const toast = await this.toastCtrl.create({
        message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Redirije a registro
  registrarme() {
    this.router.navigateByUrl('/register');
  }
}
