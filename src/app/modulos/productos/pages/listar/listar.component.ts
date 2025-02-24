import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/interfaces/product.interface';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  constructor(private productoService:ProductosService,
              private router:Router,
              private utilService: UtilsService) { }
  listProductos:IProduct [] = [];
  listProductosBase:IProduct [] = [];
  nameProductoElim = '';
  idProductoElim:any;

  cantidadMostrar = 5;
  cantResult = 0;

  animation = 'pulse'; 
  loading: boolean = true;

  toggleDropdown(i:any) {
    this.utilService.toggleDropdown(i)
  }
  ngOnInit(): void {
    this.getProductos ()
  }
  getProductos (){
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: data => {
        this.getFormatProducts(data['data'])
        this.loading = false;
      },
      error: error => console.error('Hubo un error:', error)
    });

  }

  getFormatProducts(data : []){
    if (data.length > 0) {
      data.forEach((element:IProduct) => {
        element.date_release = this.utilService.formatDate(element.date_release!, 'dd/MM/yyyy')
        element.date_revision = this.utilService.formatDate(element.date_revision!, 'dd/MM/yyyy')
      });
    }
    this.listProductosBase=data
    this.listProductos = this.listProductosBase.slice(0, this.cantidadMostrar);
    this.cantResult = this.listProductosBase.length;
  }

  crearProducto(){
    this.router.navigateByUrl("productos/crear-productos")
  }
  
  editarProducto(producto:IProduct){
    producto.date_release = this.utilService.convertDate(producto.date_release!)
    producto.date_revision = this.utilService.convertDate(producto.date_revision!)

    localStorage.setItem('productoEdit', JSON.stringify(producto))
    this.productoService.setProduct(producto);
    this.router.navigateByUrl("productos/editar-productos")
  }
  
  buscarPorTexto(event:any){
    let valSearch = event.target.value.toLowerCase()
    let tempResult ;
    if (valSearch) {
      tempResult = this.listProductosBase.filter(product => 
        this.utilService.includesText(product.name, valSearch) ||
        this.utilService.includesText(product.description, valSearch) ||
        this.utilService.includesText(product.date_release, valSearch) ||
        this.utilService.includesText(product.date_revision, valSearch)
      )
    } else{
      tempResult = this.listProductosBase
    }

    this.cantResult = tempResult.length;
    this.listProductos = tempResult.slice(0, this.cantidadMostrar);
  }

  showTable(event:any){
    let value = event.target.value
    if (value > this.listProductosBase.length) {
      this.cantidadMostrar = this.listProductosBase.length
    } else {
      this.cantidadMostrar = event.target.value
    }
    this.listProductos = this.listProductosBase.slice(0, this.cantidadMostrar);
  }

  eliminarProducto(item:any){
    this.nameProductoElim = item.name
    this.idProductoElim = item.id
  
    this.utilService.openModal() 
  }

  closeModal() {this.utilService.closeModal();}


confirmDelete() {
  this.productoService.deleteProduct(this.idProductoElim)
  .subscribe(resp =>{
    this.utilService.closeModal();
    this.getProductos();
  });
  
}

}
