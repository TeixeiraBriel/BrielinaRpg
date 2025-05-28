// signup.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../Services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  usuario = '';
  senha = '';
  focus: any;
  focus1: any;
  focus2: any;

  constructor(private authService: AuthService,
    private router: Router) {}

  registrar() {
    this.authService.register(this.usuario, this.senha).subscribe({
      next: () => {
        alert('Usuário registrado com sucesso!');
        this.router.navigateByUrl("/login"); 
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao registrar usuário.');
      }
    });
  }
}
