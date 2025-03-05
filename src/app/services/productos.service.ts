import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../interfaces/product.interface';
import { Endpoints } from '../config/endpoint.enun';



@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  urlBase = environment.urlBase;

  public product$: BehaviorSubject<IProduct> =
    new BehaviorSubject<IProduct>({});

  constructor( private readonly http: HttpClient,) { }

  getProductos() {
    const url = Endpoints.ENUM_PRODUCTS;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
  postProduct(body: object) {
    const url = Endpoints.ENUM_PRODUCTS;
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
    const url = `${Endpoints.ENUM_PRODUCTS}${idProducto}`;
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
    const url = `${Endpoints.GET_PRODUCTS_VERIFICATION}${idProducto}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
  deleteProduct(idProducto:any) {
    const url = `${Endpoints.ENUM_PRODUCTS}${idProducto}`;

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
