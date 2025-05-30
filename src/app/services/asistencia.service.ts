// src/app/services/asistencia.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, Timestamp } from '@angular/fire/firestore';
import { Asistencia } from '../interfaces/asistencia.model';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  constructor(private firestore: Firestore) {}

  registrarAsistencia(asistencia: Asistencia) {
    const ref = collection(this.firestore, 'asistencias');
    return addDoc(ref, {
      ...asistencia,
      timestamp: Timestamp.fromDate(asistencia.timestamp),
    });
  }

  async obtenerAsistenciasPorUsuario(userId: string) {
    const ref = collection(this.firestore, 'asistencias');
    const q = query(ref, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
