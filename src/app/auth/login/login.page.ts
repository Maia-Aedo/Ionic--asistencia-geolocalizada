import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NavController, AlertController, IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})

export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    // Simulación login
    if (email === 'test@example.com' && password === '123456') {
      this.navCtrl.navigateRoot('/home');
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Credenciales inválidas',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}
