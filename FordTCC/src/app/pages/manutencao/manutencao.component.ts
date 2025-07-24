// manutencao.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComputadorService } from '../../services/computador.service';
import { Computador } from '../../models/computador';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from "../header/header";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.css'],
  imports: [CommonModule, FormsModule, Header]
})
export class ManutencaoComponent implements OnInit, OnDestroy {
  computadores: Computador[] = [];
  computadoresFiltrados: Computador[] = [];
  computadoresCriticos: Computador[] = [];
  localizacoesUnicas: string[] = [];
  loading = true;

  private subscription = new Subscription();

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

  constructor(private computadorService: ComputadorService) { }

  ngOnInit(): void {
    this.carregarComputadores();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  carregarComputadores(): void {
    const sub = this.computadorService.getComputadores().subscribe({
      next: (computadores) => {
        this.computadores = computadores;
        this.localizacoesUnicas = [...new Set(this.computadores.map(c => c.localizacao))];
        this.filtrar();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar computadores:', error);
        this.loading = false;
      }
    });
    this.subscription.add(sub);
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
    if (!data) return 0;
    const hoje = new Date();
    const ultima = new Date(data);
    const anos = hoje.getFullYear() - ultima.getFullYear();
    const meses = hoje.getMonth() - ultima.getMonth();
    return anos * 12 + meses;
  }

  public encurtarId(id: string): string {
    return id.substring(0, 4);
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

  async salvarManutencao(): Promise<void> {
    if (this.manutencaoEditando.id) {
      try {
        await this.computadorService.editarComputador(
          this.manutencaoEditando.id,
          this.manutencaoEditando
        );
        this.fecharModal();
        console.log('Manutenção salva com sucesso');
      } catch (error) {
        console.error('Erro ao salvar manutenção:', error);
        alert('Erro ao salvar manutenção. Tente novamente.');
      }
    }
  }

  async excluirManutencao(id: string): Promise<void> {
    if (confirm('Tem certeza que deseja excluir este computador?')) {
      try {
        await this.computadorService.excluirComputador(id);
        console.log('Computador excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir computador:', error);
        alert('Erro ao excluir computador. Tente novamente.');
      }
    }
  }
}