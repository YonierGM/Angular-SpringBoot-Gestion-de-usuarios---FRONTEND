import { Injectable } from '@angular/core';
import { Cliente } from '../cliente';
import { Observable, throwError } from 'rxjs'

import { Router } from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../../usuarios/auth.service';

import swal from 'sweetalert2'
import { Region } from '../region';

@Injectable({
  providedIn: 'root'
})

export class ServiceClienteService {
  private urlApi:string ='http://localhost:8080/api/clientes';
  private urlRegiones:string ='http://localhost:8080/api/regiones';

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
    ) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlRegiones);
  }
  
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
    return this.http.post(this.urlApi, cliente)
    .pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status == 400){
          return throwError(() => e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
          swal.fire('Registro',''+e.error.mensaje, 'error')
        }
        return throwError(() => e)
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlApi}/${id}`).pipe(
      catchError(e => {

        if(e.status != 401 && e.error.mensaje){
          console.log(e.error.mensaje);
          this.router.navigate(['']);
        }
        return throwError(() => e)
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlApi}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if(e.status == 400){
          swal.fire('Registro','Por favor llene todos los campos', 'info')
          return throwError(() => e)
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
          swal.fire('Update',''+e.error.mensaje, 'error')
        }
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }

  delete(id?: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlApi}/${id}`).pipe(
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje);
          swal.fire('Delete',''+e.error.mensaje, 'error')
        }
        return throwError(() => e)
      })
    );
  }

  subirFoto(archivo: File, id:any): Observable<HttpEvent<any>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id);
    const req = new HttpRequest('POST',`${this.urlApi}/upload`, formData,{
      reportProgress: true
    });
    return this.http.request(req);
  }
}