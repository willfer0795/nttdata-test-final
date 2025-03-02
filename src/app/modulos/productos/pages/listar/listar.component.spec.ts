import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListarComponent } from './listar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { ProductosService } from '../../../../services/productos.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/interfaces/product.interface';

describe('ListarComponent', () => {
  let component: ListarComponent;
  let fixture: ComponentFixture<ListarComponent>;
  let productosService: ProductosService;
  let router: Router;
  let inputEl: DebugElement;

  const mockProductos: IProduct[] = [
    { id: '1', name: 'Producto 1', description: 'Descripción del Producto 1', date_release: '2023-10-10', date_revision: '2023-11-10' },
    { id: '2', name: 'Producto 2', description: 'Descripción del Producto 2', date_release: '2023-09-09', date_revision: '2023-10-09' }
  ];

  beforeEach(async () => {
    const routerSpy = { navigateByUrl: jest.fn() };
    await TestBed.configureTestingModule({
      declarations: [ListarComponent],
      imports: [RouterTestingModule, HttpClientModule], 
      providers: [
        { provide: Router, useValue: routerSpy },
        ProductosService,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    productosService = TestBed.inject(ProductosService);
    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getProductos should populate listProductosBase', () => {

    jest.spyOn(productosService, 'getProductos').mockReturnValue(of({ data: mockProductos }));

    component.getProductos();

    expect(component.listProductsBase).toEqual(mockProductos);
  });

  it('should render listProductos', waitForAsync(() => {

    jest.spyOn(productosService, 'getProductos').mockReturnValue(of({ data: mockProductos }));

    component.getProductos();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const trs = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(trs.length).toBe(2);
    });
  }));

  it('should toggle the dropdown class', () => {
    const dropdownId = 'drop_1';
    const dropdownElement = document.createElement('div');
    dropdownElement.id = dropdownId;
    document.body.appendChild(dropdownElement);

    expect(dropdownElement.classList.contains('show')).toBe(false);

    component.toggleDropdown(1);
    expect(dropdownElement.classList.contains('show')).toBe(true);

    component.toggleDropdown(1);
    expect(dropdownElement.classList.contains('show')).toBe(false);

    document.body.removeChild(dropdownElement);
  });

  it('should navigate to "productos/crear-productos"', () => {
    component.crearProducto();
    expect(router.navigateByUrl).toHaveBeenCalledWith('productos/crear-productos');
  });
  it('should convert dates, set product in localStorage, call setProduct, and navigate', () => {
    const producto: IProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '10/10/2023',
      date_revision: '11/11/2023'
    };

    const expectedProduct = {
      ...producto,
      date_release: '2023-10-10',
      date_revision: '2023-11-11'
    };

    const localStorageSetItemMock = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: localStorageSetItemMock
      },
      writable: true
    });

    const setProductSpy = jest.spyOn(productosService, 'setProduct');

    component.editarProducto(producto);

    expect(producto.date_release).toBe('2023-10-10');
    expect(producto.date_revision).toBe('2023-11-11');
    expect(localStorageSetItemMock).toHaveBeenCalledWith('productoEdit', JSON.stringify(expectedProduct));
    expect(setProductSpy).toHaveBeenCalledWith(expectedProduct);
    expect(router.navigateByUrl).toHaveBeenCalledWith('productos/editar-productos');
  });

  it('should filter listProductosBase by search text', () => {
    
    component.listProductsBase = mockProductos;
    component.quantityShow = 10;

    const event = { target: { value: 'Producto 1' } };
    component.buscarPorTexto(event);

    expect(component.listProducts.length).toBe(1);
    expect(component.listProducts[0].name).toBe('Producto 1');
    expect(component.quantityResult).toBe(1);
  });

  it('should filter listProductosBase by search text', () => {
    
    component.listProductsBase = mockProductos;
    component.quantityShow = 10;

    const event = { target: { value: '' } };
    component.buscarPorTexto(event);

    expect(component.listProducts.length).toBe(2);
    expect(component.quantityResult).toBe(2);
  });

  it('should update cantidadMostrar and listProductos based on event value', () => {

    component.listProductsBase = mockProductos;

    const event = { target: { value: 1 } };
    component.showTable(event);

    expect(component.quantityShow).toBe(1);
    expect(component.listProducts.length).toBe(1);
    expect(component.listProducts[0].name).toBe('Producto 1');
  });

  it('should update cantidadMostrar and listProductos based on event value', () => {

    component.listProductsBase = mockProductos;

    const event = { target: { value: 5 } };
    component.showTable(event);

    expect(component.quantityShow).toBe(2);
    expect(component.listProducts.length).toBe(2);
  });

  it('should set nameProductoElim and idProductoElim and call openModal', () => {
    const mockProducto = { id: '1', name: 'Producto 1', description: 'Descripción del Producto 1', date_release: '2023-10-10', date_revision: '2023-11-10' };
    component.eliminarProducto(mockProducto);

    expect(component.nameProductDelete).toBe('¿Estás seguro de eliminar el producto Producto 1?');
    expect(component.idProductDelete).toBe('1');
  });

  it('should hide the modal', () => {
    const modal = document.createElement('div');
    modal.id = 'eliminarProductoModal';
    modal.style.display = 'block';
    document.body.appendChild(modal);

    expect(document.getElementById('eliminarProductoModal')).not.toBeNull();

    component.closeModal();

    setTimeout(() => {
      expect(modal.style.display).toBe('none');
    }, 500);
    

    document.body.removeChild(modal);
  });

  it('should call deleteProduct, closeModal, and getProductos', () => {
    component.idProductDelete = '1';

    jest.spyOn(component, 'closeModal');
    jest.spyOn(component, 'getProductos');
    const deleteProductSpy = jest.spyOn(productosService, 'deleteProduct').mockReturnValue(of({}));
    component.confirmDelete();

      expect(deleteProductSpy).toHaveBeenCalledWith('1');
      expect(component.getProductos).toHaveBeenCalled();

  });

  it('should call buscarPorTexto when keyup event occurs', () => {
    const spy = jest.spyOn(component, 'buscarPorTexto');
    component.configSearch();

    const input = inputEl.nativeElement;
    input.value = 'test';
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('test');
    }, 500);
  });

  it('should call confirmDelete when value is true', () => {
    const confirmDeleteSpy = jest.spyOn(component, 'confirmDelete');
    component.selectOptionDelete(true);
    expect(confirmDeleteSpy).toHaveBeenCalled();
  });

  it('should call closeModal when value is false', () => {
    const closeModalSpy = jest.spyOn(component, 'closeModal');
    component.selectOptionDelete(false);
    expect(closeModalSpy).toHaveBeenCalled();
  });
});


