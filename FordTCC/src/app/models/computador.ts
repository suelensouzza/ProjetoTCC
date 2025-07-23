export interface Computador {
  id: string;
  nome: string;
  localizacao: string;
  modelo: string;
  memoriaPermanente: string;
  memoriaVolatil: string;
  status: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'CRITICO';
  ultimaManutencao: string;
  proximaManutencao: string;
}

export const COMPUTADORES_add: Computador[] = [
  {
    id: '1',
    nome: 'PC da Sala 101',
    localizacao: 'Sala 101',
    modelo: 'Dell Optiplex 7070',
    memoriaPermanente: '256GB SSD',
    memoriaVolatil: '16GB RAM',
    status: 'EXCELENTE',
    ultimaManutencao: '2024-05-01',
    proximaManutencao: '2024-11-01'
  },
  {
    id: '2',
    nome: 'PC do Laboratório A',
    localizacao: 'Laboratório A',
    modelo: 'HP EliteDesk 800',
    memoriaPermanente: '512GB SSD',
    memoriaVolatil: '32GB RAM',
    status: 'REGULAR',
    ultimaManutencao: '2024-06-15',
    proximaManutencao: '2024-12-15'
  }
];
