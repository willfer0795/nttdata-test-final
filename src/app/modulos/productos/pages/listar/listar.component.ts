import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/interfaces/product.interface';
import { UtilsService } from 'src/app/services/utils.service';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(private productoService:ProductosService,
              private router:Router,
              private utilService: UtilsService) { }
  listProducts:IProduct [] = [];
  listProductsBase:IProduct [] = [];
  nameProductDelete = '';
  idProductDelete:any;

  quantityShow = 5;
  quantityResult = 0;

  loading: boolean = true;

  toggleDropdown(i:any) {
    this.utilService.toggleDropdown(i)
  }
  ngOnInit(): void {
    this.getProductos ()
    this.configSearch()
  }
   configSearch() {
    if (this.searchInput) {
      fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((event: any) => {
        this.buscarPorTexto(event);
      });
    }
  }
  getProductos (){
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: data => {
        this.getFormatProducts(data['data'])
        this.loading = false;
      },
      error: _error => {this.loading = false;}
    });

  }

  getFormatProducts(data : []){
    if (data.length > 0) {
      data.forEach((element:IProduct) => {
        element.date_release = this.utilService.formatDate(element.date_release!, 'dd/MM/yyyy')
        element.date_revision = this.utilService.formatDate(element.date_revision!, 'dd/MM/yyyy')
      });
    }
    this.listProductsBase=data
    this.listProducts = this.listProductsBase.slice(0, this.quantityShow);
    this.quantityResult = this.listProductsBase.length;
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
      tempResult = this.listProductsBase.filter(product => 
        this.utilService.includesText(product.name, valSearch) ||
        this.utilService.includesText(product.description, valSearch) ||
        this.utilService.includesText(product.date_release, valSearch) ||
        this.utilService.includesText(product.date_revision, valSearch)
      )
    } else{
      tempResult = this.listProductsBase
    }

    this.quantityResult = tempResult.length;
    this.listProducts = tempResult.slice(0, this.quantityShow);
  }

  showTable(event:any){
    let value = event.target.value
    if (value > this.listProductsBase.length) {
      this.quantityShow = this.listProductsBase.length
    } else {
      this.quantityShow = event.target.value
    }
    this.listProducts = this.listProductsBase.slice(0, this.quantityShow);
  }

  eliminarProducto(item:any){
    this.nameProductDelete = item.name
    this.idProductDelete = item.id
  
    this.utilService.openModal() 
  }

  closeModal() {this.utilService.closeModal();}


confirmDelete() {
  this.productoService.deleteProduct(this.idProductDelete)
  .subscribe(resp =>{
    this.utilService.closeModal();
    this.getProductos();
  });
  
}

}
