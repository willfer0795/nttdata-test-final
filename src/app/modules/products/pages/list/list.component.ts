import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/interfaces/product.interface';
import { UtilsService } from 'src/app/services/utils.service';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListarComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  listProducts:IProduct [] = [];
  listProductsBase:IProduct [] = [];
  nameProductDelete = '';
  idProductDelete:any;

  quantityShow = 5;
  quantityResult = 0;

  loading: boolean = true;

  constructor(private readonly productService:ProductsService,
              private readonly router:Router,
              private readonly utilService: UtilsService) { }


  toggleDropdown(i:any) {
    this.utilService.toggleDropdown(i)
  }
  ngOnInit(): void {
    this.getProducts ()
    this.configSearch()
  }
   configSearch() {
    if (this.searchInput) {
      fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((event: any) => {
        this.searchByTexto(event);
      });
    }
  }
  getProducts (){
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: data => {
        this.getFormatProducts(data['data'])
        this.loading = false;
      },
      error: _error => {this.loading = false;}
    });

  }

  getFormatProducts(data : []){
    this.listProductsBase=data
    this.listProducts = this.listProductsBase.slice(0, this.quantityShow);
    this.quantityResult = this.listProductsBase.length;
  }

  createProduct(){
    this.productService.setAction("C");
    this.router.navigateByUrl("products/manage-products")
  }
  
  editProduct(product:IProduct){
    product.date_release = this.utilService.convertDate(product.date_release!)
    product.date_revision = this.utilService.convertDate(product.date_revision!)

    localStorage.setItem('productEdit', JSON.stringify(product))
    this.productService.setAction("E");
    this.productService.setProduct(product);
    this.router.navigateByUrl("products/manage-products")
  }
  
  searchByTexto(event:any){
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
    this.quantityShow = value > this.listProductsBase.length ? 
                        this.listProductsBase.length : 
                        event.target.value;
    this.listProducts = this.listProductsBase.slice(0, this.quantityShow);
  }

  deleteProduct(item:any){
    this.nameProductDelete =`¿Estás seguro de eliminar el producto ${item.name}?` 
    this.idProductDelete = item.id
  
    this.utilService.openModal('deleteProductModal') 
  }

  selectOptionDelete(value: boolean){
    if (value) {
      this.confirmDelete() 
    } else {
      this. closeModal()
    }
  }
  
  closeModal() {this.utilService.closeModal('deleteProductModal');}

  confirmDelete() {
    this.productService.deleteProduct(this.idProductDelete)
    .subscribe(_resp =>{
      this.closeModal();
      this.getProducts();
    });
    
  }

}
