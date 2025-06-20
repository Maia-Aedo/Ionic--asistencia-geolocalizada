# 📲 App de Registro de Asistencia

Aplicación móvil desarrollada con **Ionic + Angular**, que permite a usuarios registrar su **asistencia** (entrada y salida) usando:

- **Geolocalización**
- **Captura de foto**
- **Autenticación con Firebase**
- **Firestore para almacenar registros**

---

## 🚀 Tecnologías utilizadas

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Capacitor](https://capacitorjs.com/)
- [Firebase Authentication](https://firebase.google.com/products/auth)
- [Firestore Database](https://firebase.google.com/products/firestore)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins) (Camera, Geolocation)

---

## 📦 Características principales

- Login y Registro de usuarios con Firebase Auth.
- Registro de **asistencia con foto** y **ubicación GPS**.
- Validación para permitir el registro **solo dentro de una zona geográfica** predefinida.
- Historial de asistencias (entradas y salidas) por usuario.
- Cierre de sesión y navegación segura.

---

## 🛡️ Validaciones implementadas

- La ubicación debe estar dentro del **área permitida**.
- Es obligatorio tomar una foto al registrar la asistencia.
- La fecha y hora del evento son registradas automáticamente.
- Si la ubicación falla, muestra mensaje de error y no se registra la asistencia.

---

## Estado del proyecto

- Funcional.
- Testeado en navegador y android físico.
- Manejo de errores.
