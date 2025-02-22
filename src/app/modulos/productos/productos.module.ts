import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared.module';
import { CrearProductoComponent } from './pages/crear-producto/crear-producto.component';
import { ListarComponent } from './pages/listar/listar.component';
import { EditarProductoComponent } from './pages/editar-producto/editar-producto.component';


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
