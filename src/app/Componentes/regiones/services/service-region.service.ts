import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import {catchError } from 'rxjs/operators';
import { Region } from '../region';

import { AuthService } from '../../../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceRegionService {
  private urlApi:string ='http://localhost:8080/api/regiones';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
    ) { }

    getRegiones(): Observable<Region[]> {
      return this.http.get<Region[]>(this.urlApi).pipe(
        catchError(e => {
          return throwError(() => e)
        })
      )
    }

  create(region: Region): Observable<Region> {
    return this.http.post<Region>(this.urlApi, region).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(() => e)
        }

        console.log(e.error.mensaje);
        return throwError(() => e)
      })
    );

  }
  getRegion(id: number): Observable<Region> {
    return this.http.get<Region>(`${this.urlApi}/${id}`).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }

  update(region: Region): Observable<Region>{
    return this.http.put<Region>(`${this.urlApi}/${region.id}`, region).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(() => e)
        }
        
        console.log(e.error.mensaje);
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }

  delete(id?: number): Observable<Region> {
    return this.http.delete<Region>(`${this.urlApi}/${id}`).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        this.router.navigate(['']);
        return throwError(() => e)
      })
    );
  }
}
