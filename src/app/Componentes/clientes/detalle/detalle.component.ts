import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceClienteService } from '../services/service-cliente.service';

import Swal from 'sweetalert2'
import { HttpEventType } from '@angular/common/http';
import { Cliente } from '../cliente';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  
  //input file
  file: any;

  titulo: String = "Detalle Cliente";
  cliente: any;

  urlBaseImage: String = "http://localhost:8080/api/uploads/img/";

  fotoSeleccionada: any;
  progreso:number = 0;

  constructor(private service: ServiceClienteService,
    private route: ActivatedRoute) { }

  
  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any) => {
      let id:number = +params.get('id');

      if(id){
        this.service.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event:any){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;

    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      Swal.fire({
        title: 'Tipo de archivo',
        text: 'Seleccione un archivo de tipo Imagen',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3F51B5'
      });
      this.fotoSeleccionada = null;
    }

    console.log(this.fotoSeleccionada);
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire({
        title: 'Error',
        text: 'La foto no se ha cargado',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#3F51B5'
      });

    }else{
      this.service.subirFoto(this.fotoSeleccionada, this.cliente.id).
      subscribe(event => {
        //this.cliente = cliente;
        if(event.type === HttpEventType.UploadProgress){

          if(event.total)
          this.progreso = Math.round((event.loaded/event.total)*100);

          //Asigno progreso a 0 para que desaparezca
          setTimeout(()=>{
            this.progreso = 0;
          }, 2000);

          //Limpiamos el input
          this.file = '';
          
        }else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.cliente = response.cliente as Cliente; 
          
          Swal.fire({
            title: 'Foto cargada',
            text: 'La foto ha sido subida con exito',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#3F51B5'
          });
        }
      });
    }
  }
}
