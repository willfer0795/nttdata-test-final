import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from 'src/app/pages/interfaces/product.interface';
import { CustomValidators } from 'src/app/pages/validator/custom-validators';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit, OnDestroy {

  formulario:any;
  fechaLiberacionTmp :any;
  subscription: Subscription | undefined;
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
    localStorage.removeItem('productoEdit')
  }

}
