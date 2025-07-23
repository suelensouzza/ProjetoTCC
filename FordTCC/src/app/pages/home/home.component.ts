import { Component, OnInit } from '@angular/core';
import { Computador, COMPUTADORES_add } from '../../models/computador';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FormsModule]
})
export class HomeComponent implements OnInit {

  userName = 'Admin';
  computers: Computador[] = COMPUTADORES_add;

  constructor(private router: Router) {} 

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
    const today = new Date();
    const date = new Date(dateStr);
    return date < today;
  }


  excluirComputador(id: string): void {
    this.computers = this.computers.filter(c => c.id !== id);
  }

  ngOnInit(): void {
  }

  logoff(): void {
    this.router.navigate(['/login']); 
  }
}
