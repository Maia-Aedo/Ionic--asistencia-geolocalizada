import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

import { CommonModule } from '@angular/common';
import { IonicModule, NavController, AlertController } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})

export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
  async onRegister() {
    const { nombre, email, password } = this.registerForm.value;
  
    this.authService.register({ nombre, email, password }).subscribe({
      next: async () => {
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Usuario registrado correctamente',
          buttons: ['OK']
        });
        await alert.present();
        this.navCtrl.navigateRoot('/auth/login');
      },
      error: async (error: any) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: error.error?.message || 'No se pudo registrar el usuario',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
  
}
