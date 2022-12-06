import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarClientesComponent } from './Componentes/clientes/listar-clientes/listar-clientes.component';
import { FormularioComponent } from './Componentes/clientes/formulario/formulario.component';
import { DetalleComponent } from './Componentes/clientes/detalle/detalle.component';

const routes: Routes = [
  {path: '', redirectTo: 'clientes/listar', pathMatch: 'full'},
  {path: 'clientes/listar', component: ListarClientesComponent},
  {path: 'clientes/page/:page', component: ListarClientesComponent},
  {path: 'clientes/form', component: FormularioComponent},
  {path: 'clientes/form/:id', component: FormularioComponent},
  {path: 'clientes/ver/:id', component: DetalleComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
