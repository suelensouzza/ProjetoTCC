// computador.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComputadorService } from '../../services/computador.service';
import { Computador } from '../../models/computador';
import { Header } from "../header/header";

@Component({
  selector: 'app-computador',
  templateUrl: './computador.component.html',
  styleUrls: ['./computador.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, Header]
})
export class ComputadoresComponent implements OnInit, OnDestroy {
  userName: any;
  private subscription = new Subscription();

  constructor(
    private computadorService: ComputadorService,
    private router: Router
  ) { }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }

  computers: Computador[] = [];
  loading = true;

  searchTerm = '';
  selectedStatus = '';
  selectedLocation = '';

  modalAberto = false;
  modoEdicao = false;
  computadorEditandoId: string | null = null;

  novoComputador: Computador = {
    id: '',
    nome: '',
    localizacao: '',
    modelo: '',
    memoriaPermanente: '',
    memoriaVolatil: '',
    status: 'BOM',
    ultimaManutencao: '',
    proximaManutencao: ''
  };

  ngOnInit(): void {
    this.carregarComputadores();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private carregarComputadores(): void {
    const sub = this.computadorService.getComputadores().subscribe({
      next: (computadores) => {
        this.computers = computadores;
        this.loading = false;
        console.log('Computadores carregados:', computadores);
      },
      error: (error) => {
        console.error('Erro ao carregar computadores:', error);
        this.loading = false;
      }
    });
    this.subscription.add(sub);
  }

  public encurtarId(id: string): string {
    return id.substring(0, 4);
  }

  get filteredComputers(): Computador[] {
    return this.computers.filter((c: Computador) => {
      const matchSearch = c.nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus = this.selectedStatus ? c.status === this.selectedStatus : true;
      const matchLocation = this.selectedLocation ? c.localizacao === this.selectedLocation : true;
      return matchSearch && matchStatus && matchLocation;
    });
  }

  get total(): number {
    return this.computers.length;
  }

  get excellent(): number {
    return this.computers.filter((c: Computador) => c.status === 'EXCELENTE').length;
  }

  get critical(): number {
    return this.computers.filter((c: Computador) => c.status === 'CRITICO').length;
  }

  get maintenance(): number {
    const today = new Date();
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(today.getMonth() - 4);

    return this.computers.filter((c: Computador) => {
      if (!c.ultimaManutencao || c.ultimaManutencao.trim() === '') {
        return true;
      }
      let lastMaintenanceDate: Date;
      if (c.ultimaManutencao.includes('/')) {
        const [day, month, year] = c.ultimaManutencao.split('/');
        lastMaintenanceDate = new Date(+year, +month - 1, +day);
      } else if (c.ultimaManutencao.includes('-')) {
        lastMaintenanceDate = new Date(c.ultimaManutencao);
      } else {
        return true;
      }

      return lastMaintenanceDate < fourMonthsAgo;
    }).length;
  }

  computadorSelecionado: Computador | null = null;

  visualizarComputador(id: string): void {
    const computador = this.computers.find(c => c.id === id);
    if (computador) {
      this.computadorSelecionado = computador;
    } else {
      console.log('Computador não encontrado');
    }
  }

  fecharDetalhes(): void {
    this.computadorSelecionado = null;
  }

  editarComputador(computador: Computador): void {
    this.modalAberto = true;
    this.modoEdicao = true;
    this.novoComputador = { ...computador };
    this.computadorEditandoId = computador.id;
  }

  async excluirComputador(id: string): Promise<void> {
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

  abrirModal(): void {
    this.modalAberto = true;
    this.modoEdicao = false;
    this.novoComputador = {
      id: '',
      nome: '',
      localizacao: '',
      modelo: '',
      memoriaPermanente: '',
      memoriaVolatil: '',
      status: 'BOM',
      ultimaManutencao: '',
      proximaManutencao: ''
    };
    this.computadorEditandoId = null;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  async salvarComputador(): Promise<void> {
    if (
      this.novoComputador.nome &&
      this.novoComputador.localizacao &&
      this.novoComputador.modelo &&
      this.novoComputador.memoriaPermanente &&
      this.novoComputador.memoriaVolatil &&
      this.novoComputador.status
    ) {
      try {
        if (this.modoEdicao && this.computadorEditandoId) {
          await this.computadorService.editarComputador(this.computadorEditandoId, { ...this.novoComputador });
          console.log('Computador editado com sucesso');
        } else {
          await this.computadorService.adicionarComputador({ ...this.novoComputador });
          console.log('Computador adicionado com sucesso');
        }
        this.fecharModal();
      } catch (error) {
        console.error('Erro ao salvar computador:', error);
        alert('Erro ao salvar computador. Tente novamente.');
      }
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  }
}