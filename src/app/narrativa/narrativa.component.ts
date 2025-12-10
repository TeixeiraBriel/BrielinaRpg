import { Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { Narrativa } from '../Interfaces/Narrativa';
import { NarrativasService } from '../Services/Aulas/narrativas.service';
import { AuthService } from '../Services/Auth/auth.service';

@Component({
  selector: 'app-narrativa',
  templateUrl: './narrativa.component.html',
  styleUrls: ['./narrativa.component.scss']
})
export class NarrativaComponent {
  narrativaPai: Narrativa = {
    idNarrativas: 0,
    titulo: "",
    descricao: "",
    texto: "",
    ramificacoes: "",
    tipo: 0,
    autor:""
  };
  narrativaNova: Narrativa = {
    idNarrativas: 0,
    titulo: "",
    descricao: "",
    texto: "",
    ramificacoes: "",
    tipo: 0,
    autor:""
  };
  campoTextArea:string = "";
  campoTitulo:string = "";
  campoNarrativa:string = "";
  loading: boolean = false;
  narrativas: Narrativa[] = [];
  narrativaEmEdicao: Narrativa | null = null;
  modoEdicao: boolean = false;

  constructor(private offcanvasService: NgbOffcanvas, private listService: NarrativasService, private authService: AuthService ) {
    this.ResetarAventura();
  }

	openEnd(content: TemplateRef<any>, narrativa?: Narrativa) {
		if (narrativa) {
			// Modo edição
			this.modoEdicao = true;
			this.narrativaEmEdicao = narrativa;
			this.campoTitulo = narrativa.titulo;
			this.campoTextArea = narrativa.descricao;
			this.campoNarrativa = narrativa.texto;
		} else {
			// Modo criação
			this.modoEdicao = false;
			this.narrativaEmEdicao = null;
			this.campoTitulo = "";
			this.campoTextArea = "";
			this.campoNarrativa = "";
		}
		this.offcanvasService.open(content, { position: 'end' });
	}

  async getAll() {
      this.loading = true;
      try {
        this.narrativas = await firstValueFrom(this.listService.getAllChild(this.narrativaPai));
      } catch (err) {
        console.error('Erro ao buscar narrativas:', err);
        this.narrativas = [];
      } finally {
        this.loading = false;
      }
  }

  async postar(dados: any, offcanvas?: any) {
    let sucesso = false;
    try {
      this.loading = true;
      if (this.modoEdicao && this.narrativaEmEdicao) {
        // Modo edição - atualizar narrativa existente
        this.narrativaEmEdicao.titulo = dados.Titulo;
        this.narrativaEmEdicao.descricao = dados.Descricao;
        this.narrativaEmEdicao.texto = dados.campoNarrativa;
        console.log(this.narrativaEmEdicao);
        await firstValueFrom(await this.listService.Update(this.narrativaEmEdicao));
      } else {
        // Modo criação - criar nova narrativa
        this.narrativaNova.ramificacoes = this.narrativaPai.idNarrativas.toString();
        this.narrativaNova.titulo = dados.Titulo;
        this.narrativaNova.descricao = dados.Descricao;
        this.narrativaNova.texto = dados.campoNarrativa;
        this.narrativaNova.autor = this.authService.obterNomeUsuario() ?? "";
        console.log(this.narrativaNova);
        await firstValueFrom(await this.listService.Create(this.narrativaNova));
      }
      await this.getAll();
      sucesso = true;
    } catch (err) {
      console.error('Erro ao salvar narrativa:', err);
    } finally {
      this.loading = false;
    }

    if (sucesso) {
      console.debug('postar: fechamento offcanvas, offcanvas param:', offcanvas);
      try {
        if (offcanvas) {
          if (typeof offcanvas.close === 'function') {
            offcanvas.close('submitted');
          } else if (typeof offcanvas.dismiss === 'function') {
            offcanvas.dismiss('submitted');
          } else {
            this.offcanvasService.dismiss();
          }
        } else {
          this.offcanvasService.dismiss();
        }
      } catch (err) {
        console.warn('Erro ao fechar offcanvas via referência, usando fallback:', err);
        try { this.offcanvasService.dismiss(); } catch (e) { console.error('Erro ao dismiss offcanvas:', e); }
      }

      this.campoTextArea = "";
      this.campoTitulo = "";
      this.campoNarrativa = "";
      this.modoEdicao = false;
      this.narrativaEmEdicao = null;
    }
  }

  carregarNarrativa(narrativaSelecionada: Narrativa) {
    this.narrativaPai = narrativaSelecionada;
    this.narrativaNova.ramificacoes = narrativaSelecionada.idNarrativas.toString();
    this.getAll();
  }

  ResetarAventura() {
    this.narrativaPai = {
      idNarrativas: 0,
      titulo: "",
      descricao: "",
      texto: "",
      ramificacoes: "",
      tipo: 0,
      autor:""
    };
    this.narrativaNova = {
      idNarrativas: 0,
      titulo: "",
      descricao: "",
      texto: "",
      ramificacoes: "",
      tipo: 0,
      autor:""
    };
    this.getAll();
  }

  isNarrativaPadrao(): boolean {
    return this.narrativaPai.idNarrativas === 0; // ou outra l�gica que defina narrativa padr�o
  }

  isDonoNarrativa(): boolean {
    return this.narrativaPai.autor == this.authService.obterNomeUsuario(); // ou outra l�gica que defina narrativa padr�o
  }
}
