import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Cliente } from '../cliente';
import { ServiceClienteService } from '../services/service-cliente.service';
import Swal from 'sweetalert2'
import { ServiceRegionService } from '../../regiones/services/service-region.service';
import { Region } from '../../regiones/region';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  public loading: any = 0;

  nombre?:string;
  apellido?:string;
  email?:string;
  createAt?:string;
  region?:string;
  foto?:string;


  cliente: Cliente = new Cliente();
  regiones: Region[] = [];

  titulo:String = "Crear Cliente";
  errores: any;

  fotoSeleccionada: any;
  progreso:number = 0;

  constructor(

  private clienteService: ServiceClienteService,
  private ServiceRegionService: ServiceRegionService,

  private router: Router,
  private activatedRoute: ActivatedRoute) {
    this.errores = [];
   }

  ngOnInit(): void {
    let ruta = "/clientes/form"
    
    this.ServiceRegionService.getRegiones().subscribe(regiones  => this.regiones = regiones)

    if(this.router.url == ruta){
      this.loading = 0;
    }else{
      this.cargarCliente();
    }
  }

  formEdit(){
    this.router.navigate(['/clientes/form/:id'])
    this.cargarCliente();
  }

  compareRegion(o1: Region, o2: Region): boolean {
    if(o1 == undefined && o2 == undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined? false: o1.id === o2.id;
  }

  public cargarCliente(): void{
    this.loading = 1;
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.titulo = "Editar Registro"
        this.clienteService.getCliente(id).subscribe( (cliente) => {
          this.loading = 0;
          this.cliente = cliente 
        }
         )
      }
    })
  }

  public create(): void {
    this.loading = 1;

      this.clienteService.create(this.cliente).subscribe({
        next: (v) => {

          this.router.navigate(['/clientes/listar'])

          Swal.fire({
            title: ''+this.cliente.nombre,
            text: 'Cliente '+this.cliente.nombre + ' creado con exito',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3F51B5'
          })
        }, 
        error: (e) => {
          this.errores = e.error.errors as string[];
          console.error(e)
        },

        complete: () =>{
          console.info('complete')
          this.loading = 0;
        } 
    })
  }

  update(): void{
    this.loading = 1;
    this.clienteService.update(this.cliente)
    .subscribe({
      next: (v) => {
        this.router.navigate(['/clientes/listar'])
        Swal.fire({
          title: ''+this.cliente.nombre,
          text: 'Cliente '+this.cliente.nombre + ' actualizado con exito',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3F51B5'
        })
      },
      error: (e) => {
        this.errores = e.error.errors as string[];
        console.error(e)
      },
      complete: () => {
        console.info('complete') 
        this.loading = 0;

      } 
    })
  }
}
