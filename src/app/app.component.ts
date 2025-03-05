import { Component, OnInit } from '@angular/core';
import { ProductosService } from './services/productos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title = 'nttdata-test';

  constructor(private readonly productoService:ProductosService) { }

  ngOnInit(): void {
    let productoEdit = localStorage.getItem('productoEdit');
    let dataProd = productoEdit ? JSON.parse(productoEdit) : null;

    this.productoService.setProduct(dataProd);
  }
}
