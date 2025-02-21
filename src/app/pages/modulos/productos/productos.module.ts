import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { ListarComponent } from './listar/listar.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [
    CrearProductoComponent,
    ListarComponent,
    EditarProductoComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    DatePipe,
  ],
  providers: [DatePipe]
})
export class ProductosModule { }
