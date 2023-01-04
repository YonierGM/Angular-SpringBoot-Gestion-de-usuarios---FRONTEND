import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Componentes/header/header.component';
import { FooterComponent } from './Componentes/footer/footer.component';
import { FormsModule } from '@angular/forms';

//Interceptors
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
//

import localeES from '@angular/common/locales/es'

//Necesario para la comunicacion http api - frontend
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';

//
import { ListarClientesComponent } from './Componentes/clientes/listar-clientes/listar-clientes.component';
import { FormularioComponent } from './Componentes/clientes/formulario/formulario.component'
//
import {registerLocaleData } from '@angular/common';
import { PaginatorComponent } from './Componentes/paginator/paginator.component';


//Idioma local
registerLocaleData( localeES, 'es');
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './Componentes/clientes/detalle/detalle.component';
import { ListarComponent } from './Componentes/regiones/listar/listar.component';
import { CrearComponent } from './Componentes/regiones/crear/crear.component';
import { LoginComponent } from './usuarios/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ListarClientesComponent,
    FormularioComponent,
    PaginatorComponent,
    DetalleComponent,
    ListarComponent,
    CrearComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],

  //Locale_id configurar idioma local
  providers: [
    {provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
