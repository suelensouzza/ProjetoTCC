import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ComputadoresComponent } from './pages/computador/computador.component';
import { ManutencaoComponent } from './pages/manutencao/manutencao.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'computadores', component: ComputadoresComponent },
  { path: 'manutencao', component: ManutencaoComponent },
];