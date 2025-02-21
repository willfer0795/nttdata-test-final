import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductosService } from './services/productos.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let productoService: ProductosService;

  beforeEach(() => {
    const productoServiceSpy = {
      setProduct: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [
                RouterTestingModule,
              ],
      declarations: [AppComponent],
      providers: [
        { provide: ProductosService, useValue: productoServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    productoService = TestBed.inject(ProductosService);
  });

  describe('ngOnInit', () => {
    it('should set product from localStorage', () => {
      const mockProduct = { id: '1', name: 'Product 1' };
      const localStorageGetItemMock = jest.fn().mockReturnValue(JSON.stringify(mockProduct));
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: localStorageGetItemMock
        },
        writable: true
      });

      component.ngOnInit();

      expect(productoService.setProduct).toHaveBeenCalledWith(mockProduct);
    });

    it('should set product to null if localStorage is empty', () => {
      const localStorageGetItemMock = jest.fn().mockReturnValue(null);
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: localStorageGetItemMock
        },
        writable: true
      });

      component.ngOnInit();

      expect(productoService.setProduct).toHaveBeenCalledWith(null);
    });
  });

});
