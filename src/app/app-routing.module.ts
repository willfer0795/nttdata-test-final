import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'productos', loadChildren: () => import('./modulos/productos/productos.module').then(m => m.ProductosModule) },
  { path: '**', redirectTo: 'productos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
