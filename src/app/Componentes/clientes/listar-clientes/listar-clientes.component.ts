import { Component, OnInit , OnChanges, SimpleChanges } from '@angular/core';
import { Cliente } from '../cliente';
import { ServiceClienteService } from '../services/service-cliente.service';

import Swal from 'sweetalert2'
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../usuarios/auth.service';
@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css']
})
export class ListarClientesComponent implements OnInit, OnChanges {
  
  displayedColumns: string[] = ['nombre','apellido','email','createAt'];

  public loading: any = 0;

  urlBaseImage: String = "http://localhost:8080/api/uploads/img/";

  mostrar: boolean = false;
  clientes: Cliente[] = []
  paginador: any;

  detalle = 0;

  constructor(
    private clienteService: ServiceClienteService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let clientesActualizado = changes['paginador'];
    if (clientesActualizado.previousValue) {
      this.cargarClientes();
    }
  }

  cargarClientes(){
    this.loading = 1;
    
    this.activatedRoute.paramMap.subscribe( (params:any) => {
      let page:number = +params.get('page');

      if(!page){
        page = 0;
      }
      
      this.clienteService.getClientes(page)
      .pipe(
        tap(response => {
          
          (response.content as Cliente[]).forEach(cliente => {

          });
        })
      ).subscribe({

        next: (v) => {

          this.clientes = v.content as Cliente[];
          this.paginador = v;

          console.log(this.paginador)
        }, 
        error: (e) => {
          console.error(e)
        },

        complete: () =>{
          console.info('complete')
          this.loading = 0;
   
        } 
      });
    });
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: '¿Desea eliminar este registro?',
      text: "Se eliminará "+cliente.nombre+ ' de manera permanente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B53FB3',
      cancelButtonColor: '#3F51B5',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = 1;
        this.clienteService.delete(cliente.id).subscribe(
          
          res => {
            this.cargarClientes()
            Swal.fire(
              'Eliminado',
              'El registro ha sido eliminado',
              'success'
            )
            this.loading = 0;
          }
        )
      }
    })
  }
}
