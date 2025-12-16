import { Component } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  focus: any;
  focus1: any;
  usuario = '';
  senha = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    if (!this.usuario || !this.senha) {
      alert('Preencha todos os campos!');
      return;
    }

    this.authService.login(this.usuario, this.senha).subscribe({
      next: (res: any) => {
        if (res?.token) {
          this.authService.salvarToken(res.token);
          alert('Login realizado com sucesso!');
          this.router.navigateByUrl(this.returnUrl); // redireciona para onde o usu�rio queria ir
        } else {
          alert('Token n�o recebido.');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Usu�rio ou senha inv�lidos.');
      }
    });
  }
}
