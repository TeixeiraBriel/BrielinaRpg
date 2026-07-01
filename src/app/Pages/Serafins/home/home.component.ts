import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { Tema } from 'src/app/Interfaces/Tema';
import { ComentariosDialogComponent } from '../comentarios/comentarios-dialog.component';
import { TemaService } from 'src/app/Services/Temas/temas.service';

@Component({
  selector: 'app-serafins-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class SerafinsHomeComponent implements OnInit {
  temas: Tema[] = [];
  usuarioLogado = "";
  nomeUsuarioLogado = "";
  carregando = false;
  meusTemasCount = 0;

  constructor(
    private authService: AuthService,
    private temaService: TemaService,
    private dialog: MatDialog
  ) {
    this.usuarioLogado = this.authService.obterNomeUsuario();
    let usuarioCompleto = this.authService.obterUsuarioCompleto();
    this.nomeUsuarioLogado = usuarioCompleto?.nome;
    console.log(usuarioCompleto);
  }

  ngOnInit() {
    this.carregarTemas();
  }

  // ← CARREGA DA API
  private carregarTemas() {
    this.carregando = true;
    this.temaService.listar().subscribe({
      next: (temas) => {
        this.temas = temas;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar temas:', err);
        this.carregando = false;
        alert('Erro ao carregar temas.');
      }
    });
  }

  private atualizarContadorTemas() {
    this.meusTemasCount = this.temas.filter(t => t.responsavel === this.usuarioLogado).length;
  }

  tornarResponsavel(tema: Tema) {
    this.carregando = true;
    this.temaService.assumirResponsavel(tema.id).subscribe({
      next: () => this.carregarTemas(),
      error: () => {
        this.carregando = false;
        alert('Erro ao assumir responsável.');
      }
    });
  }

  definirDataApresentacaoHoje(tema: Tema) {
    this.temaService.definirDataHoje(tema.id).subscribe({
      next: () => {
        tema.dataApresentacao = new Date();
      },
      error: (err) => {
        console.error('Erro ao definir data:', err);
        alert('Erro ao definir data.');
      }
    });
  }

  abrirComentarios(tema: Tema) {
    const dialogRef = this.dialog.open(ComentariosDialogComponent, {
      width: '600px',
      data: { tema, usuario: this.usuarioLogado }
    });

    dialogRef.afterClosed().subscribe(novoComentario => {
      if (novoComentario) {
        // ← SALVA NA API
        this.temaService.criarComentario(tema.id, novoComentario.texto).subscribe({
          next: () => {
            // recarrega os comentários ou adiciona na lista local
            if (!tema.comentarios) tema.comentarios = [];
            tema.comentarios.push({
              autor: this.usuarioLogado,
              texto: novoComentario.texto,
              data: new Date()
            });
          },
          error: (err) => {
            console.error('Erro ao salvar comentário:', err);
            alert('Erro ao salvar comentário.');
          }
        });
      }
    });
  }
}
