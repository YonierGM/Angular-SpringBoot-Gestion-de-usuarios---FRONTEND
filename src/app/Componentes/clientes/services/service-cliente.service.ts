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
  private urlRegiones:string ='http://localhost:8080/api/regiones';
  
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
    return this.http.post<Cliente[]>(this.urlApi, cliente, {headers: this.httpHeaders})
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
    return this.http.get<Cliente>(`${this.urlApi}/${id}`).pipe(
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
    return this.http.put<Cliente>(`${this.urlApi}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
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
    return this.http.delete<Cliente>(`${this.urlApi}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        this.router.navigate(['']);
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

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(() => e)
      })
    )
  }

  private isNoAutorizado(e: any): boolean{
    if(e.status== 401 || e.status== 403){ // codigo 401 Unauthorized - 403 acceso denegado
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }
}
