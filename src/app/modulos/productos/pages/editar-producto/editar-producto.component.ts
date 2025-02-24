import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from 'src/app/interfaces/product.interface';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit, OnDestroy {

  formulario:any;
  fechaLiberacionTmp :any;
  subscription: Subscription;
  productEdit: IProduct = {};
  constructor(
    private productoService:ProductosService,
    private router:Router
  ) {
    this.subscription = this.productoService.product$.subscribe(
      (value:IProduct) => {
        this.productEdit = value;
      }
    );
  }

  ngOnInit() {}

  return = () =>{
    this.router.navigateByUrl("productos/listar-productos")
  }

  ngOnDestroy(): void {
    localStorage.removeItem('productoEdit');
    this.subscription.unsubscribe();
  }

}
