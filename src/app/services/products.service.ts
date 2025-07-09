import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProduct } from '../interfaces/product.interface';
import { Endpoints } from '../config/endpoint.enun';
import { UtilsService } from './utils.service';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  urlBase = environment.urlBase;

  public product$: BehaviorSubject<IProduct> =
    new BehaviorSubject<IProduct>({});

  public productAction$: BehaviorSubject<string> =
  new BehaviorSubject<string>("");

  constructor( private readonly http: HttpClient,private readonly utilService: UtilsService) { }

  getProducts() {
    return this.http.get(Endpoints.ENUM_PRODUCTS).pipe(
      map((resp: any) => {
        let data = resp['data'];
        if (data.length > 0) {
          data.forEach((element:IProduct) => {
            element.date_release = this.utilService.formatDate(element.date_release!, 'dd/MM/yyyy')
            element.date_revision = this.utilService.formatDate(element.date_revision!, 'dd/MM/yyyy')
          });
        }
        resp['data'] = data;
        return resp;
      })
    );
  }
  postProduct(body: object) {
    const bodyrequest = JSON.stringify(body);
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(Endpoints.ENUM_PRODUCTS, bodyrequest, { headers }).pipe(
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

  public setAction(action: string): void {
    this.productAction$.next(action);
  }
}
