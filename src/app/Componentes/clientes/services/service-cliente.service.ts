import { Injectable } from '@angular/core';
import { Cliente } from '../cliente';
import { Observable, throwError } from 'rxjs'
import swal from 'sweetalert2'
import { Router } from '@angular/router';

import { map, catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceClienteService {
  private urlApi:string ='http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient,
    private router: Router) { }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlApi + '/page/' + page)
    .pipe(
      tap((res: any) =>  {
        console.log("clienteService: Tap 1");
        (res.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre)
        })
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlApi, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }

        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );

  }
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlApi}/${id}`).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        this.router.navigate(['']);
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlApi}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }
        
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        this.router.navigate(['']);
        return throwError(e);
      })
    );
  }

  delete(id?: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlApi}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        this.router.navigate(['']);
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id:any): Observable<HttpEvent<{}>>{

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST',`${this.urlApi}/upload`, formData,{
      reportProgress: true

    });

    return this.http.request(req);
  }


}
