import { Component } from '@angular/core';
import { Student } from '../../shared/interfaces/Student.interface';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})

export class HomePage {

  public actionSheetButtons = [
    {
      text: 'Ausente',
      role: 'destructive',
      data:{
        action: 'delete'
      },
      icon: 'trash',
    },
    {
      text: 'Presente',
      role: 'present',
      data:{
        action: 'present'
      },
      icon: 'checkmark',
    },
    {
      text:'Tarde',
      role: 'late',
      data:{
        action: 'late'
      },
      icon: 'time',
    },
    {
      text:'Cancelar',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel'
      }
    }
  ]

  students: Student[] = [
    { firstName: 'Juan', lastName: 'Pérez', avatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg', present: false },
    { firstName: 'María', lastName: 'García', avatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg', present: false },
    { firstName: 'Carlos', lastName: 'Ramírez', avatar: 'https://img.freepik.com/free-vector/smiling-redhaired-cartoon-boy_1308-174709.jpg?semt=ais_hybrid', present: false },
    { firstName: 'Ana', lastName: 'Sánchez', avatar: 'https://img.freepik.com/free-vector/blonde-boy-blue-hoodie_1308-175828.jpg', present: false },
  ];

  constructor() {}

  guardarAsistencia() {
    console.log('Asistencia guardada:', this.students);
  }

  async obtenerUbicacion() {
    const position = await Geolocation.getCurrentPosition();
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  }

}