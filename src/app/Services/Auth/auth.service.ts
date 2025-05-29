import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://brielinaapi.onrender.com/Token';

  constructor(private http: HttpClient) {}

  login(usuario: string, senha: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { usuario, senha });
  }

  register(usuario: string, senha: string) {
    return this.http.post<any>(`${this.baseUrl}/register`, { usuario, senha });
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

  obterNomeUsuario(): string{
    const token = this.obterToken();
    if (!token) return "";

    // Decodifica o JWT para extrair o nome do usuário
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.unique_name || payload?.sub || "";
  }
}
