import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../../interfaces/UserDTO'
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}`, user);
  }

  update(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, user);
  }

  login(login: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { login, senha });
  }

  checkLoginExists(login: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${login}`);
  }

  findById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`);
  }

  findAll(page: number, size: number, sort: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<any>(this.apiUrl, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
