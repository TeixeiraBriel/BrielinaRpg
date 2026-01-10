import { Comentario } from "./Comentario";

export interface Tema {
  id: number;
  livro: string;
  responsavel?: string | null;
  dataApresentacao?: Date | string | null;
  comentarios?: Comentario[];
}