import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })

export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  /**
   * 
   * @description fn de autenticación utilizando métodos de firebase auth
   */

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  // Obtiene estado de autenticación
  getAuthState() {
    return this.afAuth.authState;
  }
} 