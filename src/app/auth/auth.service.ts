import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  login(login: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, {
      login,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode<any>(token);

    return decoded.sub;
  }
}
