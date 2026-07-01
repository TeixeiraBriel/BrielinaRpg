// signup.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
  nome = '';
  usuario = '';
  email = '';
  senha = '';

  focus: any;
  focus1: any;
  focus2: any;
  focusEmail: any;

  isLoading = false;

  constructor(private authService: AuthService,
    private router: Router) { }

  registrar() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.register({
      nome: this.nome,
      usuario: this.usuario,
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: (response) => {
        alert('Usuário registrado com sucesso!');
        this.router.navigateByUrl("/login");
        this.isLoading = false;  // ✅ OK aqui
      },
      error: (err) => {
        console.error(err);
        alert(err.error || 'Erro ao registrar usuário.');
        this.isLoading = false;  // ✅ OK aqui
      }
    });
  }

  onUsuarioInput(event: any) {
    const semEspaco = event.target.value.replace(/\s/g, '');
    this.usuario = semEspaco;
  }
}

