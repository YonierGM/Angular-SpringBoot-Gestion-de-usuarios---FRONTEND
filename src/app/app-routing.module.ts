import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarClientesComponent } from './Componentes/clientes/listar-clientes/listar-clientes.component';
import { FormularioComponent } from './Componentes/clientes/formulario/formulario.component';
import { DetalleComponent } from './Componentes/clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';

const routes: Routes = [

  {path: '', redirectTo: 'clientes/listar', pathMatch: 'full'},
  {path: 'clientes/listar', component: ListarClientesComponent},
  {path: 'clientes/page/:page', component: ListarClientesComponent},
  {path: 'clientes/form', component: FormularioComponent, canActivate: [AuthGuard,RoleGuard], data: { role: ['ROLE_ADMIN'] }},
  {path: 'clientes/form/:id', component: FormularioComponent , canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] }},
  {path: 'clientes/ver/:id', component: DetalleComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_USER','ROLE_ADMIN'] }},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: 'clientes/listar', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
