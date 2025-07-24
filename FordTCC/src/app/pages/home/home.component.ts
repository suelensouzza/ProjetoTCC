// home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Computador } from '../../models/computador';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from "../header/header";
import { ComputadorService } from '../../services/computador.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FormsModule, Header]
})
export class HomeComponent implements OnInit, OnDestroy {
  userName = 'Admin';
  computers: Computador[] = [];
  loading = true;
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private computadorService: ComputadorService
  ) {}

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
        console.log('Computadores carregados no home:', computadores);
      },
      error: (error) => {
        console.error('Erro ao carregar computadores no home:', error);
        this.loading = false;
      }
    });
    this.subscription.add(sub);
  }

  get totalComputers(): number {
    return this.computers.length;
  }

  get computersInMaintenance(): number {
    const today = new Date();
    return this.computers.filter(c => new Date(c.proximaManutencao.split('-').reverse().join('-')) < today).length;
  }

  get excellentCount(): number {
    return this.computers.filter(c => c.status === 'EXCELENTE').length;
  }

  get criticalCount(): number {
    return this.computers.filter(c => c.status === 'CRITICO').length;
  }

  get maintenanceCount(): number {
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'EXCELENTE': return 'etiqueta-status-excelente';
      case 'BOM': return 'etiqueta-status-bom';
      case 'CRITICO': return 'etiqueta-status-critico';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'EXCELENTE': return '#28a745';
      case 'BOM': return '#ffc107';
      case 'CRITICO': return '#dc3545';
      default: return '#6c757d';
    }
  }

  isOverdue(dateStr: string): boolean {
    if (!dateStr) return false;
    const today = new Date();
    const date = new Date(dateStr);
    return date < today;
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

  logoff(): void {
    this.router.navigate(['/login']);
  }
}