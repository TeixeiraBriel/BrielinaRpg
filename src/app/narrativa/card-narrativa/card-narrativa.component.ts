import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-narrativa',
  templateUrl: './card-narrativa.component.html',
  styleUrls: ['./card-narrativa.component.scss']
})
export class CardNarrativaComponent {
  @Input() narrativa: {
    idNarrativas: Number,
    titulo: String
    descricao: String
    texto: String
    ramificacoes: String
    tipo: Number
  } = {
    idNarrativas: 0,
    titulo: "",
    descricao: "",
    texto: "",
    ramificacoes: "",
    tipo: 0
  };

  constructor() {
    console.log(this.narrativa);
  }
}
