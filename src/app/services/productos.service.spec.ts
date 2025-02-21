import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductosService } from './productos.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';

describe('ProductosService', () => {
  let service: ProductosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [ProductosService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(ProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    const dummyProducts = [
      { id: '1', name: 'Product 1', description: 'Description 1' },
      { id: '2', name: 'Product 2', description: 'Description 2' }
    ];

    service.getProductos().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${environment.urlBase}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should post a product to the API via POST', () => {
    const newProduct = { id: '3', name: 'Product 3', description: 'Description 3' };

    service.postProduct(newProduct).subscribe(response => {
      expect(response).toEqual(newProduct);
    });

    const req = httpMock.expectOne(`${environment.urlBase}/bp/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(newProduct));
    req.flush(newProduct);
  });

  it('should update a product via PUT', () => {
    const updatedProduct = { id: '1', name: 'Updated Product', description: 'Updated Description' };

    service.updateProduct(updatedProduct, '1').subscribe(response => {
      expect(response).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${environment.urlBase}/bp/products/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(JSON.stringify(updatedProduct));
    req.flush(updatedProduct);
  });

  it('should validate product ID via GET', () => {
    const validationResponse = true;

    service.validateIdProduct('1').subscribe(response => {
      expect(response).toBe(validationResponse);
    });

    const req = httpMock.expectOne(`${environment.urlBase}/bp/products/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(validationResponse);
  });

  it('should delete a product via DELETE', () => {
    const deleteResponse = { success: true };

    service.deleteProduct('1').subscribe(response => {
      expect(response).toEqual(deleteResponse);
    });

    const req = httpMock.expectOne(`${environment.urlBase}/bp/products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(deleteResponse);
  });

  it('should set a product using setProduct', () => {
    const newProduct = { id: '1', name: 'Product 1', description: 'Description 1' };

    service.setProduct(newProduct);

    service.product$.subscribe(product => {
      expect(product).toEqual(newProduct);
    });
  });
});
