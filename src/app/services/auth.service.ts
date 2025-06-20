import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private currentUserSubject = new BehaviorSubject<firebase.User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

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

  logout() {
    return this.afAuth.signOut();
  }

  // Obtiene estado de autenticación
  getAuthState() {
    return this.afAuth.authState;
  }

  getCurrentUser() {
    return this.afAuth.currentUser;
  }

} 