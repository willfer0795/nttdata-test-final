import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of } from 'rxjs';
import { FormRegisterComponent } from './form-register.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductosService } from 'src/app/services/productos.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastComponent } from '../toast/toast.component';

describe('FormRegisterComponent', () => {
  let component: FormRegisterComponent;
  let fixture: ComponentFixture<FormRegisterComponent>;
  let productosService: ProductosService;
  let utilService: UtilsService;
  let router: Router;
  let toastComponent: ToastComponent;

  const mockProduct = {
    id: '1',
    name: 'Producto 1',
    description: 'Descripción del Producto 1',
    logo: 'logo.png',
    date_release: '2023-10-10',
    date_revision: undefined
  }

  beforeEach(async () => {
    const routerSpy = { navigateByUrl: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ FormRegisterComponent,ToastComponent ],
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
              DatePipe,
              UtilsService,
              { provide: Router, useValue: routerSpy },
            ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormRegisterComponent);
    component = fixture.componentInstance;
    toastComponent = fixture.debugElement.children[0].componentInstance;
    component.toastComponent = toastComponent;
    productosService = TestBed.inject(ProductosService); 
    utilService = TestBed.inject(UtilsService); 
    component.accion = 'E';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call postProduct and navigate when accion is C', (done) => {
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
      setTimeout(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');
        done();
      }, 3000);
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
      setTimeout(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');
      }, 3000);

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

    expect(component.form.get('id')?.value).toBe('');
    expect(component.form.get('nombre')?.value).toBeNull();
    expect(component.form.get('descripcion')?.value).toBeNull();
    expect(component.form.get('logo')?.value).toBeNull();
    expect(component.form.get('fechaLiberacion')?.value).toBeNull();
    expect(component.form.get('fechaRevision')?.value).toBeNull();
  });

  it('should set error if id exists', fakeAsync(() => {
    const idControl = component.form.get('id');
    jest.spyOn(productosService, 'validateIdProduct').mockReturnValue(of(true));

    component.setupIdFieldValidation();

    idControl?.setValue('123');
    tick(500);

    expect(idControl?.hasError('idExists')).toBe(true);
  }));

  it('should not set error if id does not exist', fakeAsync(() => {
    const idControl = component.form.get('id');
    jest.spyOn(productosService, 'validateIdProduct').mockReturnValue(of(false));

    component.setupIdFieldValidation();

    idControl?.setValue('123');
    tick(500);

    expect(idControl?.hasError('idExists')).toBe(false);
  }));

  it('should set fechaRevision one year after fechaLiberacion', () => {
    const control = component.form.get('fechaLiberacion');
    const fechaInicial = new Date(2023, 0, 1);

    const parseDateSpy = jest.spyOn(utilService, 'parseDate').mockReturnValue(fechaInicial);
    const formatearFechaSpy = jest.spyOn(utilService, 'formatearFecha').mockReturnValue('01/01/2024');

    control?.setValue('01/01/2023');
    component.setDateRevision(control);

    expect(parseDateSpy).toHaveBeenCalledWith('01/01/2023');
    expect(formatearFechaSpy).toHaveBeenCalled();
    expect(component.form.get('fechaRevision')?.value).toBe('01/01/2024');
  });

  it('should not set fechaRevision if fechaLiberacion is not provided', () => {
    const control = component.form.get('fechaLiberacion');

    control?.setValue(null);
    component.setDateRevision(control);

    expect(component.form.get('fechaRevision')?.value).toBe(undefined);
  });

  it('should call showToast on toastComponent with error message', () => {
    const spyToast =  jest.spyOn(toastComponent, 'showToast');
    const errorMessage = 'An error occurred';
    component.showError(errorMessage);

    expect(spyToast).toHaveBeenCalledWith(errorMessage, 'error');
  });
});
