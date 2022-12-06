import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente';
import { ServiceClienteService } from '../services/service-cliente.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  private nombre:any ="";
  private apellido:any ="";
  private email:any ="";
  private createAt:any ="";
  private foto:any ="";

  public cliente: Cliente = new Cliente(this.nombre, this.apellido, this.email, this.createAt, this.foto);
  public titulo:String = "Crear Cliente";
  public errores: any;

  constructor(private clienteService: ServiceClienteService,
  private router: Router,
  private activatedRoute: ActivatedRoute) {
    this.errores = [];
   }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.titulo = "Editar Registro"
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente )
      }
    })
  }
  
  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      res => {
        this.router.navigate([''])

        Swal.fire({
          title: ''+this.cliente.nombre,
          text: 'Cliente '+this.cliente.nombre + ' creado con exito',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#3F51B5'
        })
      },
      err => {
        this.errores = err.error.errors as string[];
      }
      );
  }

  update(): void{
    this.clienteService.update(this.cliente)
    .subscribe( cliente => {
      this.router.navigate([''])

      Swal.fire({
        title: ''+this.cliente.nombre,
        text: 'Cliente '+this.cliente.nombre + ' actualizado con exito',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3F51B5'
      })
    },
      err => {
        this.errores = err.error.errors as string[];
      }
    )
  }
}
