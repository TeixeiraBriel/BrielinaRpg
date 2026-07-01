import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comentarios-dialog',
  templateUrl: './comentarios-dialog.component.html'
})
export class ComentariosDialogComponent {
  novoComentario = '';

  constructor(
    public dialogRef: MatDialogRef<ComentariosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tema: any, usuario: string }
  ) {}

  fechar() {
    this.dialogRef.close();
  }

  salvar() {
    const comentario = {
      autor: this.data.usuario,
      texto: this.novoComentario.trim(),
      data: new Date()
    };

    this.dialogRef.close(comentario);
  }
}
