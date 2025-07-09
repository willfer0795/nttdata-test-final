import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared.module';
import { ListarComponent } from './pages/list/list.component';
import { ManageProductsComponent } from './pages/manage-products/manage-products.component';


@NgModule({
  declarations: [
    ListarComponent,
    ManageProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    DatePipe,
  ],
  providers: [DatePipe]
})
export class ProductsModule { }
