import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Region } from '../region';

import swal from 'sweetalert2'
import { AuthService } from '../../../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceRegionService {
  private urlApi:string ='http://localhost:8080/api/regiones';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
    ) { }

    getRegiones(): Observable<Region[]> {
      return this.http.get<Region[]>(this.urlApi,{headers: this.agregarAuthorizationHeader()}).pipe(
        catchError(e => {
          this.isNoAutorizado(e);
          return throwError(() => e)
        })
      )
    }

  create(region: Region): Observable<Region> {
    return this.http.post<Region>(this.urlApi, region, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(() => e)
        }

        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e)
      })
    );

  }
  getRegion(id: number): Observable<Region> {
    return this.http.get<Region>(`${this.urlApi}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }

  update(region: Region): Observable<Region>{
    return this.http.put<Region>(`${this.urlApi}/${region.id}`, region, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {

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

  delete(id?: number): Observable<Region> {
    return this.http.delete<Region>(`${this.urlApi}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }

  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null ){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: any): boolean{
    if(e.status== 401 || e.status== 403){ // codigo 401 Unauthorized - 403 acceso denegado
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }
}
