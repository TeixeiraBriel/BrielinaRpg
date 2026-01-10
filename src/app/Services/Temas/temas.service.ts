import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Comentario } from "src/app/Interfaces/Comentario";
import { Tema } from "src/app/Interfaces/Tema";

// tema.service.ts
@Injectable({ providedIn: 'root' })
export class TemaService {  
  private baseUrl = "https://brielinaapi.onrender.com/Serafins/temas";
  //private baseUrl = "https://localhost:7036/Serafins/temas";

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Tema[]>(this.baseUrl);
  }

  criar(livro: string) {
    return this.http.post(this.baseUrl, { livro });
  }

  assumirResponsavel(id: number) {
    return this.http.post(`${this.baseUrl}/${id}/assumir-responsavel`, {});
  }

  definirDataHoje(id: number) {
    const hoje = new Date().toISOString();
    return this.http.post(`${this.baseUrl}/${id}/definir-data`, hoje);
  }

  listarComentarios(temaId: number) {
    return this.http.get<Comentario[]>(`${this.baseUrl}/${temaId}/comentarios`);
  }

  criarComentario(temaId: number, texto: string) {
    return this.http.post(`${this.baseUrl}/comentarios`, { temaId, texto });
  }
}
