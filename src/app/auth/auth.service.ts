import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private baseUrl="http://localhost:3000/api";

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

  private setToken(token:string){
    localStorage.setItem('token', token);
  }
  
}