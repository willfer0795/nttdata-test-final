import { CrearProductoComponent } from './crear-producto.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { ProductosService } from '../../../../services/productos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('CrearProductoComponent', () => {
  let component: CrearProductoComponent;
  let fixture: ComponentFixture<CrearProductoComponent>;
  let productosService: ProductosService;
  let formBuilder: FormBuilder;
  let httpMock: HttpTestingController;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockRouter = {
          navigateByUrl: jest.fn(),
        } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [CrearProductoComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HttpClientModule,
        ReactiveFormsModule, 
        FormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        ProductosService,
        FormBuilder,
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CrearProductoComponent);
    component = fixture.componentInstance;
    productosService = TestBed.inject(ProductosService); 
    formBuilder = TestBed.inject(FormBuilder); 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('postProductos should return success message and data', () => {
    const requestBody = {
      "id": "dos",
      "name": "Operador_PE",
      "description": "wilooooooooooooo",
      "logo": "wwww",
      "date_release": "2024-07-18",
      "date_revision": "2025-07-18"
    };

    const expectedResponse = {
      "message": "Product added successfully",
      "data": {
        "id": "dos",
        "name": "Operador_PE",
        "description": "wilooooooooooooo",
        "logo": "wwww",
        "date_release": "2024-07-18",
        "date_revision": "2025-07-18"
      }
    };

    productosService.postProduct(requestBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toEqual('POST'); 
    req.flush(expectedResponse);
  });

  test('should navigate to list products on return', () => {
    component.return();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');
  });


});


