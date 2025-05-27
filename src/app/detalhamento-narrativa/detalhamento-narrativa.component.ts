import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalhamento-narrativa',
  templateUrl: './detalhamento-narrativa.component.html',
  styleUrls: ['./detalhamento-narrativa.component.scss']
})
export class DetalhamentoNarrativaComponent  {
  @Input() dadosAula: {
    IdAulas: Number,
    Professor: String
    Tema: String
    ResumoAula: String
    Ministracao: String
    DataAula: String
    QtdAlunos: Number
    QtdBiblias: Number
    QtdVisitantes: Number
  } = {
      IdAulas: 0,
      Professor: "",
      Tema: "",
      ResumoAula: "",
      Ministracao: "",
      DataAula: "",
      QtdAlunos: 0,
      QtdBiblias: 0,
      QtdVisitantes: 0
    };
}