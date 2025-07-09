import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './pages/list/list.component';
import { ManageProductsComponent } from './pages/manage-products/manage-products.component';


const routes: Routes = [
  { path: 'list-products', component:ListarComponent},
  { path: 'manage-products', component:ManageProductsComponent},
  { path: '**', redirectTo: 'list-products' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
