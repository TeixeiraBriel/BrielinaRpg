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

  constructor(private offcanvasService: NgbOffcanvas, private listService: NarrativasService, private authService: AuthService ) {
    this.ResetarAventura();
  }

	openEnd(content: TemplateRef<any>) {
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

  async postar(dados: any) {
    this.narrativaNova.ramificacoes = this.narrativaPai.idNarrativas.toString();
    this.narrativaNova.titulo = dados.Titulo;
    this.narrativaNova.descricao = dados.Descricao;
    this.narrativaNova.texto = dados.campoNarrativa;
    this.narrativaNova.autor = this.authService.obterNomeUsuario() ?? "";
    console.log(this.narrativaNova)
    try {
      this.loading = true;
      const retorno = await firstValueFrom(await this.listService.Create(this.narrativaNova));
      await this.getAll();
    } finally {
      this.loading = false;
    }
    this.offcanvasService.dismiss();
    this.campoTextArea = "";
    this.campoTitulo = "";
    this.campoNarrativa = "";
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
}
