import { Component, OnInit } from '@angular/core';
import { ComputadorService } from '../../services/computador.service';
import { Computador } from '../../models/computador';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from "../header/header";

@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.css'],
  imports: [CommonModule, FormsModule, Header]
})
export class ManutencaoComponent implements OnInit {
  computadores: Computador[] = [];
  computadoresFiltrados: Computador[] = [];
  computadoresCriticos: Computador[] = [];
  localizacoesUnicas: string[] = [];

  filtroLocalizacao: string = '';
  filtroAtrasoMinimo: number = 4;
  termoBusca: string = '';
  atrasoMedio: number = 0;

  modalAberto: boolean = false;  

  manutencaoEditando: Computador = {
    id: '',
    nome: '',
    localizacao: '',
    modelo: '',
    memoriaPermanente: '',
    memoriaVolatil: '',
    status: 'EXCELENTE',
    ultimaManutencao: '',
    proximaManutencao: ''
  };

  constructor(private computadorService: ComputadorService) {}

  ngOnInit(): void {
    this.carregarComputadores();
  }

  carregarComputadores(): void {
    this.computadores = this.computadorService.getComputadores();
    this.localizacoesUnicas = [...new Set(this.computadores.map(c => c.localizacao))];
    this.filtrar();
  }

  filtrar(): void {
    const termo = this.termoBusca.toLowerCase();

    this.computadoresFiltrados = this.computadores.filter(c => {
      const okLocal = this.filtroLocalizacao ? c.localizacao === this.filtroLocalizacao : true;
      const atraso = this.calcularMesesDesdeUltimaManutencao(c.ultimaManutencao);
      const okAtraso = atraso >= this.filtroAtrasoMinimo;
      const okBusca = c.nome.toLowerCase().includes(termo) || c.id?.includes(termo);
      return okLocal && okAtraso && okBusca;
    });

    this.computadoresCriticos = this.computadores.filter(c =>
      this.calcularMesesDesdeUltimaManutencao(c.ultimaManutencao) > 4
    );

    this.atrasoMedio = this.computadoresCriticos.length > 0
      ? Math.round(this.computadoresCriticos.reduce((acc, c) =>
          acc + this.calcularMesesDesdeUltimaManutencao(c.ultimaManutencao), 0
        ) / this.computadoresCriticos.length)
      : 0;
  }

  calcularMesesDesdeUltimaManutencao(data: string): number {
    const hoje = new Date();
    const ultima = new Date(data);
    const anos = hoje.getFullYear() - ultima.getFullYear();
    const meses = hoje.getMonth() - ultima.getMonth();
    return anos * 12 + meses;
  }

  

abrirModal(manutencao: Computador): void {
  this.manutencaoEditando = { ...manutencao };
  this.modalAberto = true;
}

fecharModal(): void {
  this.modalAberto = false;
  this.resetarManutencaoEditando();
}


  resetarManutencaoEditando(): void {
    this.manutencaoEditando = {
      id: '',
      nome: '',
      localizacao: '',
      modelo: '',
      memoriaPermanente: '',
      memoriaVolatil: '',
      status: 'EXCELENTE',
      ultimaManutencao: '',
      proximaManutencao: ''
    };
  }

  salvarManutencao(): void {
    if (this.manutencaoEditando.id) {
      this.computadorService.editarComputador(
        this.manutencaoEditando.id,
        this.manutencaoEditando
      );
      this.fecharModal();  // Fecha o modal após salvar
      this.carregarComputadores();  // Recarrega os computadores
    }
  }

  excluirManutencao(id: string): void {
    this.computadorService.excluirComputador(id);
    this.carregarComputadores();  // Recarrega os computadores após exclusão
  }
}
