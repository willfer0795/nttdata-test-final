import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ManageProductsComponent } from './manage-products.component';

import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { IProduct } from 'src/app/interfaces/product.interface';
import { jest } from '@jest/globals';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';


describe('ManageProductsComponent', () => {
  let component: ManageProductsComponent;
  let fixture: ComponentFixture<ManageProductsComponent>;
  let mockProductosService: jest.Mocked<ProductsService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockProductosService = {
      product$: of({} as IProduct),
      productAction$: of(""),
      setAction: jest.fn(),
      setProduct: jest.fn()
    } as unknown as jest.Mocked<ProductsService>;

    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [ManageProductsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProductsService, useValue: mockProductosService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProductsComponent);
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
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('productos/list-products');
  });
});
