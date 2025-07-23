import { Injectable } from '@angular/core';
import { Computador, COMPUTADORES_add } from '../models/computador';

@Injectable({
  providedIn: 'root'
})
export class ComputadorService {
  private computadores: Computador[] = [...COMPUTADORES_add]; 

  getComputadores(): Computador[] {
    return this.computadores;
  }

  adicionarComputador(novo: Computador): void {
    novo.id = crypto.randomUUID();
    this.computadores.push(novo);
  }

  excluirComputador(id: string): void {
    this.computadores = this.computadores.filter(c => c.id !== id);
  }

  editarComputador(id: string, atualizado: Computador): void {
    const index = this.computadores.findIndex(c => c.id === id);
    if (index !== -1) {
      this.computadores[index] = { ...atualizado, id };
    }
  }
}
