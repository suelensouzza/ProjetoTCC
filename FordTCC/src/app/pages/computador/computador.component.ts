import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComputadorService } from '../../services/computador.service';
import { Computador, COMPUTADORES_add } from '../../models/computador';


@Component({
  selector: 'app-computador',
  templateUrl: './computador.component.html',
  styleUrls: ['./computador.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ComputadoresComponent implements OnInit {
userName: any;
  constructor(
    private computadorService: ComputadorService,
    private router: Router
  ) {}

  voltarHome(): void {
    this.router.navigate(['/home']);
  }

  computers: Computador[] = [];

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
    this.computers = this.computadorService.getComputadores();
    console.log('Computadores carregados:', this.computers);
  }

  public encurtarId(id: string): string {
    return id.substring(0, 5);
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
    return this.computers.filter((c: Computador) => {
      const [day, month, year] = c.proximaManutencao.split('/');
      const nextDate = new Date(+year, +month - 1, +day);
      return nextDate < today;
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

  excluirComputador(id: string): void {
    this.computadorService.excluirComputador(id);
    this.computers = this.computadorService.getComputadores();
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

  salvarComputador(): void {
    if (
      this.novoComputador.nome &&
      this.novoComputador.localizacao &&
      this.novoComputador.modelo &&
      this.novoComputador.memoriaPermanente &&
      this.novoComputador.memoriaVolatil &&
      this.novoComputador.status
    ) {
      if (this.modoEdicao && this.computadorEditandoId) {
        this.computadorService.editarComputador(this.computadorEditandoId, { ...this.novoComputador });
      } else {
        this.computadorService.adicionarComputador({ ...this.novoComputador });
      }
      this.computers = this.computadorService.getComputadores();
      this.fecharModal();
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  }
}
