import { Injectable } from '@angular/core';
import { Cliente } from '../cliente';
import { Observable, throwError } from 'rxjs'
import swal from 'sweetalert2'
import { Router } from '@angular/router';

import { map, catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ServiceClienteService {
  private urlApi:string ='http://localhost:8080/api/clientes';
  private urlRegiones:string ='http://localhost:8080/api/regiones';
  
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
    ) { }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlApi + '/page/' + page)
    .pipe(
      tap((res: any) =>  {
        (res.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        })
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente[]>(this.urlApi, cliente, { headers: this.agregarAuthorizationHeader() })
    .pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(() => e)
        }

        if(e.status == 400){
          console.log("error 400")
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e)
      })
    );

  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlApi}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(() => e)
        }

        console.log(e.error.mensaje);
        swal.fire('No se pudo mostrar al cliente', e.error.mensaje, 'error');
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlApi}/${cliente.id}`, cliente, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {

        if(this.isNoAutorizado(e)){
          return throwError(() => e)
        }

        if(e.status == 400){
          return throwError(() => e)
        }
        
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }

  delete(id?: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlApi}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      
      catchError(e => {
        
        if(e.status == 403){
          swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'error');
        }else{

          swal.fire(e.error.mensaje, e.error.error, 'error');
          this.router.navigate(['/clientes/listar']);
        }
        return throwError(() => e)
      })
    );
  }

  subirFoto(archivo: File, id:any): Observable<HttpEvent<any>>{

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id);

    let httpHeaders =  new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    const req = new HttpRequest('POST',`${this.urlApi}/upload`, formData,{
      reportProgress: true,
      headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(() => e)
      })
    )
  }

  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null ){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: any): boolean{
    if(e.status == 401 ){ // codigo 401 Unauthorized

      //Cerrar sesion cuando haya expirado el token
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }

      swal.fire('Acceso','Por favor inicie sesion', 'warning')
      this.router.navigate(['/login'])
      return true;
    }

    if(e.status == 403){ // codigo 401 Unauthorized - 403 acceso denegado
      swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning')
      this.router.navigate(['/clientes/listar'])
      return true;
    }
    return false;
  }
}
