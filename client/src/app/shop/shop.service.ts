import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../shared/models/Product';
import { Pagination } from '../shared/models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl ='https://localhost:5001/api/';

  constructor(private http: HttpClient) {
   }

   getProducts(){
    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products');
   }
}
