import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title = 'nttdata-test';

  constructor(private readonly productoService:ProductsService) { }

  ngOnInit(): void {
    let productEdit = localStorage.getItem('productEdit');
    let dataProd = productEdit ? JSON.parse(productEdit) : {};

    this.productoService.setProduct(dataProd);
  }
}
