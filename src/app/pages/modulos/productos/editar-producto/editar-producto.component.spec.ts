
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EditarProductoComponent } from './editar-producto.component';
import { ProductosService } from 'src/app/services/productos.service';
import { IProduct } from 'src/app/pages/interfaces/product.interface';
import { jest } from '@jest/globals';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditarProductoComponent', () => {
  let component: EditarProductoComponent;
  let fixture: ComponentFixture<EditarProductoComponent>;
  let mockProductosService: jest.Mocked<ProductosService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockProductosService = {
      product$: of({} as IProduct),
    } as jest.Mocked<ProductosService>;

    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [EditarProductoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProductosService, useValue: mockProductosService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create component', () => {
    expect(component).toBeTruthy();
  });


  test('should navigate to list products on return', () => {
    component.return();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');
  });

});