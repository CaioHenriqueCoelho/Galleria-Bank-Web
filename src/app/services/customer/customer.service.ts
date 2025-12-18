import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CustomerDTO } from '../../interfaces/CustomerDTO';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  findAll(page: number, size: number, sort: string): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', sort);

  return this.http.get<any>(this.apiUrl, { params });
}

  findById(id: number): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.apiUrl}/${id}`);
  }

  create(customer: CustomerDTO): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(this.apiUrl, customer);
  }

  update(id: number, customer: CustomerDTO): Observable<CustomerDTO> {
    return this.http.put<CustomerDTO>(`${this.apiUrl}/${id}`, customer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
