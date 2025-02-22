import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../interfaces/product.interface';



@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  urlBase = environment.urlBase;

  public product$: BehaviorSubject<IProduct> =
    new BehaviorSubject<IProduct>({});

  constructor( private http: HttpClient,) { }

  getProductos() {
    const url = `${this.urlBase}/bp/products`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
  postProduct(body: object) {
    const url = `${this.urlBase}/bp/products`;
    const bodyrequest = JSON.stringify(body);
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(url, bodyrequest, { headers }).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
  updateProduct(body: object, idProducto:any) {
    const url = `${this.urlBase}/bp/products/${idProducto}`;
    const bodyrequest = JSON.stringify(body);
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.put(url, bodyrequest, { headers }).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  validateIdProduct(idProducto:any) {
    const url = `${this.urlBase}/bp/products/verification/${idProducto}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
  deleteProduct(idProducto:any) {
    const url = `${this.urlBase}/bp/products/${idProducto}`;

    return this.http.delete(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  public setProduct(newProduct: IProduct): void {
    this.product$.next(newProduct);
  }
}
