import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl="http://localhost:3000/api";
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(credenciales: {email:string, password:string}){
    return this.http.post(`${this.baseUrl}/auth/login`, credenciales)
    .pipe(
      tap((resp:any)=>{
        this.setToken(resp.token)
      })
    )
  }

  register(data: { nombre: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  async getToken(): Promise<string | null> {
    const { value } = await Storage.get({ key: this.tokenKey });
    return value;
  }

  async logout() {
    await Storage.remove({ key: this.tokenKey });
  }

  private setToken(token:string){
    localStorage.setItem('token', token);
  }
  
}