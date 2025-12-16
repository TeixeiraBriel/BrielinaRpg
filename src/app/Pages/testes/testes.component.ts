import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.scss']
})
export class TestesComponent {
  mutado: number = 1;

  toggleMute() {
    this.mutado = this.mutado === 1 ? 0 : 1;
  }

  constructor(private sanitizer: DomSanitizer) {}

  getVideoUrl(): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=${this.mutado}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
