import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';

const firebaseConfig= {
    apiKey: "AIzaSyABuDjOGyyYCQryhFOYauOnvZTgerJQrZI",
    authDomain: "projeto-gerenciamento-6dd4e.firebaseapp.com",
    databaseURL: "https://projeto-gerenciamento-6dd4e-default-rtdb.firebaseio.com",
    projectId: "projeto-gerenciamento-6dd4e",
    storageBucket: "projeto-gerenciamento-6dd4e.firebasestorage.app",
    messagingSenderId: "22524257052",
    appId: "1:22524257052:web:2ef83730783fc0453690d9",
    measurementId: "G-ELHR4V093K"
  };

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};