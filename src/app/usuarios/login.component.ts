import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  titulo: string = "Iniciar sesion";
  usuario: Usuario;

  username: string ="";
  password: string ="";
  nombre: string ="";
  apellido: string ="";
  email: string ="";
  roles: string[] = [];

  constructor(
    private authService : AuthService,
    private router: Router
  ) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  login(): void {
    console.log(this.usuario)
    
    if(this.usuario.username == "" || this.usuario.password == ""){
      swal.fire('Login','Llene todos los campos','error')
      return;
    }

    this.authService.login(this.usuario).subscribe({
      next: (v) => {
        console.log(v);

        this.authService.guardarUsuario(v.access_token);
        this.authService.guardarToken(v.access_token);

        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes'])
        swal.fire('Login',`hola ${usuario.username}, has iniciado sesion `,'success')
      }, 
      error: (e) => {
        console.error(e)
        if(e.status == 400){
          swal.fire('Login','Datos incorrectos, verifique por favor','error');
        }
      },
      complete: () => console.info('complete')
  })

  }
}
