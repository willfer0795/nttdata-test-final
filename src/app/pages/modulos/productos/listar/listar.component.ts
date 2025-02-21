import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/pages/interfaces/product.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  constructor(private productoService:ProductosService,private router:Router,private datePipe: DatePipe) { }
  listProductos:IProduct [] = [];
  listProductosBase:IProduct [] = [];
  nameProductoElim = '';
  idProductoElim:any;

  cantidadMostrar = 5;
  cantResult = 0;

  animation = 'pulse'; 
  loading: boolean = true;

  toggleDropdown(i:any) {
    let objTxt = document.getElementById(`drop_${i}`) as HTMLTextAreaElement;
    if (objTxt) {
      if (objTxt.classList.contains('show')) {
        objTxt.classList.remove('show')
      } else {
        objTxt.classList.add('show')
      }
    }
  }
  ngOnInit(): void {
    
    this.getProductos ()

  }
  getProductos (){
    this.loading = true;
    this.productoService.getProductos()
    .subscribe(resp =>{
      if (resp['data'].length > 0) {
        resp['data'].forEach((element:IProduct) => {
          element.date_release = this.formatDate(element.date_release!, 'dd/MM/yyyy')
          element.date_revision = this.formatDate(element.date_revision!, 'dd/MM/yyyy')
        });
      }
      this.listProductosBase=resp['data']
      this.listProductos = this.listProductosBase.slice(0, this.cantidadMostrar);
      this.cantResult = this.listProductosBase.length;
      this.loading = false;
    });
  }

  formatDate(dateString: string, format: string): string {
    if (!dateString ) {
      return ''
    };
    const date = new Date(dateString+' 00:00:00');

    return this.datePipe.transform(date, format) ?? '';
  }

  convertDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    const date = new Date(+year, +month - 1, +day);
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
  crearProducto(){
    this.router.navigateByUrl("productos/crear-productos")
  }
  editarProducto(producto:IProduct){
    producto.date_release = this.convertDate(producto.date_release!)
    producto.date_revision = this.convertDate(producto.date_revision!)

    localStorage.setItem('productoEdit', JSON.stringify(producto))
    this.productoService.setProduct(producto);
    this.router.navigateByUrl("productos/editar-productos")
  }
  buscarPorTexto(event:any){
    let valSearch = event.target.value
    let tempResult ;
    if (valSearch) {
      tempResult = this.listProductosBase.filter(p => 
        p.name?.toLowerCase().includes(valSearch.toLowerCase()) || 
        p.description?.toLowerCase().includes(valSearch.toLowerCase()) ||
        p.date_release?.toLowerCase().includes(valSearch.toLowerCase()) ||
        p.date_revision?.toLowerCase().includes(valSearch.toLowerCase())
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
  
    this.openModal() 
  }

 openModal() {
  const modal = document.getElementById('eliminarProductoModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

 closeModal() {
  const modal = document.getElementById('eliminarProductoModal');
  if (modal) {
    modal.style.display = 'none';
  }
}


confirmDelete() {
  this.productoService.deleteProduct(this.idProductoElim)
  .subscribe(resp =>{
    this.closeModal();
    this.getProductos();
  });
  
}

}
