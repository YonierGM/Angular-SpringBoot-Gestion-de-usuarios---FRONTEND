import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';

import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  logout():void {
    let username = this.authService.usuario.username;
    this.authService.logout();
    swal.fire('Logout',`${username}, Vuelva pronto`,'success');
      this.router.navigate(['/login']);

  }

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
  }

}
