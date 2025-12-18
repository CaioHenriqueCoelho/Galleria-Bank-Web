import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OrderDTO } from '../../interfaces/OrderDTO';
import { OrderCreateDTO } from '../../interfaces/OrderCreateDTO';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  create(order: OrderCreateDTO): Observable<OrderDTO> {
    return this.http.post<OrderDTO>(this.apiUrl, order);
  }

    findAll(page: number = 0, size: number = 10, sort: string = 'createdAt,desc'): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
