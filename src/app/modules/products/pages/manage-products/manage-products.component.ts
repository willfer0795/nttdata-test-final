import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from 'src/app/interfaces/product.interface';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  productEdit: IProduct = {};
  action: string = "";

  constructor(
      private readonly productoService:ProductsService,
      private readonly router:Router
    ) {
      
    this.subscriptions.add(
      this.productoService.product$.subscribe((value: IProduct) => {
        this.productEdit = value;
        this.productoService.setAction( this.productEdit?.id ? "E" : "C")
        console.log('this.productEdit: ', this.productEdit)
      })
    );

    // Agregar la segunda suscripción
    this.subscriptions.add(
      this.productoService.productAction$.subscribe((value: string) => {
        this.action = value;
        console.log('this.action: ', this.action)
      })
    );
    }

  ngOnInit() {}

  return = () =>{
    this.router.navigateByUrl("productos/list-products")
  }

  ngOnDestroy(): void {
    localStorage.removeItem('productoEdit');
    this.productoService.setProduct({});
    this.subscriptions.unsubscribe();
  }
}
