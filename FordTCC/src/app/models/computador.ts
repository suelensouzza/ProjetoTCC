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

/*export const COMPUTADORES_add: Computador[] = [
  {
    id: '3',
    nome: 'ssaadm',
    localizacao: 'Open Adm',
    modelo: 'Dell Optiplex 5090',
    memoriaPermanente: '512GB SSD',
    memoriaVolatil: '16GB RAM',
    status: 'EXCELENTE',
    ultimaManutencao: '2025-05-20',
    proximaManutencao: '2025-09-20'
  },
  {
    id: '4',
    nome: 'ssafiscal',
    localizacao: 'Sala Fiscal',
    modelo: 'HP ProDesk 400 G7',
    memoriaPermanente: '1TB SSD',
    memoriaVolatil: '32GB RAM',
    status: 'BOM',
    ultimaManutencao: '2025-03-10',
    proximaManutencao: '2025-07-10'
  },
  {
    id: '5',
    nome: 'ssajuridico',
    localizacao: 'Sala de Reunião',
    modelo: 'Lenovo ThinkCentre M75q',
    memoriaPermanente: '256GB SSD',
    memoriaVolatil: '8GB RAM',
    status: 'REGULAR',
    ultimaManutencao: '2025-02-05',
    proximaManutencao: '2025-06-05'
  },
  {
    id: '6',
    nome: 'ssati',
    localizacao: 'Sala Tecnologia',
    modelo: 'Acer Aspire TC-895',
    memoriaPermanente: '512GB SSD',
    memoriaVolatil: '16GB RAM',
    status: 'EXCELENTE',
    ultimaManutencao: '2025-07-15',
    proximaManutencao: '2025-11-15'
  },
  {
    id: '7',
    nome: 'ssalogistica',
    localizacao: 'Sala 202',
    modelo: 'Asus ExpertCenter D5',
    memoriaPermanente: '1TB HDD',
    memoriaVolatil: '8GB RAM',
    status: 'CRITICO',
    ultimaManutencao: '2025-05-30',
    proximaManutencao: '2025-09-30'
  }
];

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}*/



