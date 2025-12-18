import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDTO } from '../../interfaces/ProductDTO';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  findAll(page: number, size: number, sort: string): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', sort);

  return this.http.get<any>(this.apiUrl, { params });
}

  findById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`);
  }

  create(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(this.apiUrl, product);
  }

  update(id: number, product: ProductDTO): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
