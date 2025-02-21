import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';

const routes: Routes = [
  { path: 'listar-productos', component:ListarComponent},
  { path: 'crear-productos', component:CrearProductoComponent},
  { path: 'editar-productos', component:EditarProductoComponent},
  { path: '**', redirectTo: 'listar-productos' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
