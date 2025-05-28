import { Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { Narrativa } from '../Interfaces/Narrativa';
import { NarrativasService } from '../Services/Aulas/narrativas.service';
import { DadosBase } from '../Interfaces/DadosBase';

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
    tipo: 0
  };
  narrativaNova: Narrativa = {
    idNarrativas: 0,
    titulo: "",
    descricao: "",
    texto: "",
    ramificacoes: "",
    tipo: 0
  };
  campoTextArea:string = "";
  campoTitulo:string = "";
  campoNarrativa:string = "";
  narrativas: Narrativa[] = [];

  constructor(private offcanvasService: NgbOffcanvas, private listService: NarrativasService ) {
    this.ResetarAventura();
  }

	openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}

  async getAll() {
      this.narrativas = await firstValueFrom(this.listService.getAllChild(this.narrativaPai));
  }

  async postar(dados: any) {
    console.log(dados)
    this.narrativaNova.ramificacoes = this.narrativaPai.idNarrativas.toString();
    this.narrativaNova.titulo = dados.Titulo;
    this.narrativaNova.descricao = dados.Descricao;
    this.narrativaNova.texto = dados.campoNarrativa;
    const retorno = await firstValueFrom(await this.listService.Create(this.narrativaNova));
    this.getAll();
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
      tipo: 0
    };
    this.narrativaNova = {
      idNarrativas: 0,
      titulo: "",
      descricao: "",
      texto: "",
      ramificacoes: "",
      tipo: 0
    };
    this.getAll();
  }

  isNarrativaPadrao(): boolean {
    return this.narrativaPai.idNarrativas === 0; // ou outra lógica que defina narrativa padrão
  }
}
