// computador.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, getDocs } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Computador } from '../models/computador';

@Injectable({
  providedIn: 'root'
})
export class ComputadorService {
  private firestore = inject(Firestore);

  getComputadores(): Observable<Computador[]> {
    const computadoresRef = collection(this.firestore, 'computadores');
    
    return from(getDocs(computadoresRef)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Computador));
      })
    );
  }

  async adicionarComputador(computador: Computador): Promise<void> {
    const computadoresRef = collection(this.firestore, 'computadores');
    const { id, ...computadorSemId } = computador;
    await addDoc(computadoresRef, computadorSemId);
  }

  async editarComputador(id: string, computador: Computador): Promise<void> {
    const computadorDoc = doc(this.firestore, 'computadores', id);
    const { id: _, ...computadorSemId } = computador;
    await updateDoc(computadorDoc, computadorSemId);
  }

  async excluirComputador(id: string): Promise<void> {
    const computadorDoc = doc(this.firestore, 'computadores', id);
    await deleteDoc(computadorDoc);
  }
}