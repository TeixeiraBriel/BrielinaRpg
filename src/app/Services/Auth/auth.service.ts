import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://brielinaapi.onrender.com/Token';
  //private baseUrl = 'https://localhost:7036/Token';

  constructor(private http: HttpClient) { }

  login(usuario: string, senha: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { usuario, senha });
  }

  register(dados: { nome: string; usuario: string; email: string; senha: string }) {
    return this.http.post<any>(`${this.baseUrl}/register`, dados);
  }

  salvarToken(token: string) {
    localStorage.setItem('token', token);
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogado(): boolean {
    return !!this.obterToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  obterNomeUsuario(): string {
    const token = this.obterToken();
    if (!token) return "";

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.unique_name || payload?.name || payload?.sub || "";
    } catch {
      return "";
    }
  }

  // ← NOVOS MÉTODOS ÚTEIS
  obterUsuarioId(): number | null {
    const token = this.obterToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return parseInt(payload?.nameid || '0');
    } catch {
      return null;
    }
  }

  obterUsuarioCompleto() {
    const token = this.obterToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: parseInt(payload?.nameid || '0'),
        nome: payload?.given_name || '',
        usuario: payload?.unique_name || payload?.name || '',
        email: payload?.email || '',
        perfil: payload?.role || ''
      };
    } catch {
      return null;
    }
  }
}
