import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarClientesComponent } from './Componentes/clientes/listar-clientes/listar-clientes.component';
import { FormularioComponent } from './Componentes/clientes/formulario/formulario.component';
import { DetalleComponent } from './Componentes/clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';

const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'clientes/listar', component: ListarClientesComponent},
  {path: 'clientes/page/:page', component: ListarClientesComponent},
  {path: 'clientes/form', component: FormularioComponent},
  {path: 'clientes/form/:id', component: FormularioComponent},
  {path: 'clientes/ver/:id', component: DetalleComponent},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
  {path: '', redirectTo: 'login', pathMatch: 'full'} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
