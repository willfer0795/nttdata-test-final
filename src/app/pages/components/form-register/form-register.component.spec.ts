import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { FormRegisterComponent } from './form-register.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductosService } from 'src/app/services/productos.service';
import { Router } from '@angular/router';

describe('FormRegisterComponent', () => {
  let component: FormRegisterComponent;
  let fixture: ComponentFixture<FormRegisterComponent>;
let productosService: ProductosService;
  let formBuilder: FormBuilder;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockProduct = {
    id: '1',
    name: 'Producto 1',
    description: 'Descripción del Producto 1',
    logo: 'logo.png',
    date_release: '2023-10-10',
    date_revision: '2023-11-10'
  }

  beforeEach(async () => {
    const routerSpy = { navigateByUrl: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ FormRegisterComponent ],
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
              { provide: Router, useValue: routerSpy },
            ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormRegisterComponent);
    component = fixture.componentInstance;
    productosService = TestBed.inject(ProductosService); 
    component.accion = 'E';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call postProduct and navigate when accion is C', () => {
    component.accion = 'C';
    const customerData = {
      id: '1',
      nombre: 'Producto 1',
      descripcion: 'Descripción del Producto 1',
      logo: 'logo.png',
      fechaLiberacion: '2023-10-10',
      fechaRevision: '2023-11-10'
    };
    const updateProductSpy = jest.spyOn(productosService, 'postProduct').mockReturnValue(of({}));
    component.onSubmit(customerData);

      expect(updateProductSpy).toHaveBeenCalledWith(mockProduct);
      expect(router.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');
  });

  it('should call updateProduct and navigate when accion is E', () => {
    component.accion = 'E';
    component.editProduct = { id: '1' };
    const customerData = {
      nombre: 'Producto 1',
      descripcion: 'Descripción del Producto 1',
      logo: 'logo.png',
      fechaLiberacion: '2023-10-10',
      fechaRevision: '2023-11-10'
    };
    
    const updateProductSpy = jest.spyOn(productosService, 'updateProduct').mockReturnValue(of({}));
    component.onSubmit(customerData);

      expect(updateProductSpy).toHaveBeenCalledWith(mockProduct, '1');
      expect(router.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');

  });
  it('should reset the form and keep the id value when accion is E', () => {
    component.accion = 'E';
    component.form.setValue({
      id: '123',
      nombre: 'Producto 1',
      descripcion: 'Descripción del Producto 1',
      logo: 'logo.png',
      fechaLiberacion: '2023-10-10',
      fechaRevision: '2023-11-10'
    });

    component.resetForm();

    expect(component.form.get('id')?.value).toBe('123');
    expect(component.form.get('nombre')?.value).toBeNull();
    expect(component.form.get('descripcion')?.value).toBeNull();
    expect(component.form.get('logo')?.value).toBeNull();
    expect(component.form.get('fechaLiberacion')?.value).toBeNull();
    expect(component.form.get('fechaRevision')?.value).toBeNull();
  });

  it('should reset the form completely when accion is not E', () => {
    component.accion = 'C';
    component.form.setValue({
      id: '123',
      nombre: 'Producto 1',
      descripcion: 'Descripción del Producto 1',
      logo: 'logo.png',
      fechaLiberacion: '2023-10-10',
      fechaRevision: '2023-11-10'
    });

    component.resetForm();

    expect(component.form.get('id')?.value).toBeNull();
    expect(component.form.get('nombre')?.value).toBeNull();
    expect(component.form.get('descripcion')?.value).toBeNull();
    expect(component.form.get('logo')?.value).toBeNull();
    expect(component.form.get('fechaLiberacion')?.value).toBeNull();
    expect(component.form.get('fechaRevision')?.value).toBeNull();
  });
});
