import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ServiceClienteService } from '../services/service-cliente.service';
import Swal from 'sweetalert2'
import { Region } from '../region';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  loading: any = 0;

  nombre:string ='';
  apellido:string ='';
  email:string ='';
  createAt:string ='';
  region:string = '';
  foto:string ='';

  cliente: Cliente = new Cliente();
  regiones: Region[] = [];
  errores: string[] = [];

  titulo:String = "Nuevo Cliente";

  fotoSeleccionada: any;
  progreso:number = 0;

  constructor(

  private clienteService: ServiceClienteService,
  private router: Router,
  private activatedRoute: ActivatedRoute

  ) {}

  ngOnInit(): void {
    let ruta = "/clientes/form"
    
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones)

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

  volver(){
    Swal.fire({
      title: '¿Desea salir?',
      text: "Está a punto de salir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#B53FB3',
      cancelButtonColor: '#3F51B5',
      confirmButtonText: 'Si, Salir',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/clientes/listar'])
      }
    })
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
        this.titulo = "Editar Cliente"
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

          this.loading = 0;

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
          console.error('Código del error desde el backend: ' + e.status);
          console.error(e.error.errors);
          this.loading = 0;
        },

        complete: () =>{
          console.info('complete')
        } 
    })
  }

  update(): void{
    this.loading = 1;
    this.clienteService.update(this.cliente)
    .subscribe({
      next: (v) => {
        this.loading = 0;
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
      } 
    })
  }
}
