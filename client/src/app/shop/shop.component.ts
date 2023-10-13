import { Component } from '@angular/core';
import { Product } from '../shared/models/Product';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  products:Product[] =[];

  constructor(private shopService: ShopService){}

  ngOnInit(){
    this.shopService.getProducts().subscribe({
      next: response => this.products = response.data,
      error : error => console.log(error)
    })
  }

}
