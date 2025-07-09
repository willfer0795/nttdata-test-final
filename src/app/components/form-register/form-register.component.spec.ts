import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of } from 'rxjs';
import { FormRegisterComponent } from './form-register.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastComponent } from '../toast/toast.component';

describe('FormRegisterComponent', () => {
  let component: FormRegisterComponent;
  let fixture: ComponentFixture<FormRegisterComponent>;
  let productService: ProductsService;
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
              ProductsService,
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
    productService = TestBed.inject(ProductsService); 
    utilService = TestBed.inject(UtilsService); 
    component.action = 'E';
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call postProduct and navigate when action is C', (done) => {
    component.action = 'C';
    const customerData = {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción del Producto 1',
      logo: 'logo.png',
      dateRelease: '2023-10-10',
      dateRevision: '2023-11-10'
    };
    const updateProductSpy = jest.spyOn(productService, 'postProduct').mockReturnValue(of({}));
    component.onSubmit(customerData);

      expect(updateProductSpy).toHaveBeenCalledWith(mockProduct);
      setTimeout(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('products/list-products');
        done();
      }, 3000);
  });

  it('should call updateProduct and navigate when action is E', () => {
    component.action = 'E';
    component.editProduct = { id: '1' };
    const customerData = {
      name: 'Producto 1',
      description: 'Descripción del Producto 1',
      logo: 'logo.png',
      dateRelease: '2023-10-10',
      dateRevision: '2023-11-10'
    };
    
    const updateProductSpy = jest.spyOn(productService, 'updateProduct').mockReturnValue(of({}));
    component.onSubmit(customerData);

      expect(updateProductSpy).toHaveBeenCalledWith(mockProduct, '1');
      setTimeout(() => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');
      }, 3000);

  });
  it('should reset the form and keep the id value when action is E', () => {
    component.action = 'E';
    component.form.setValue({
      id: '123',
      name: 'Producto 1',
      description: 'Descripción del Producto 1',
      logo: 'logo.png',
      dateRelease: '2023-10-10',
      dateRevision: '2023-11-10'
    });

    component.resetForm();

    expect(component.form.get('id')?.value).toBe('123');
    expect(component.form.get('name')?.value).toBeNull();
    expect(component.form.get('description')?.value).toBeNull();
    expect(component.form.get('logo')?.value).toBeNull();
    expect(component.form.get('dateRelease')?.value).toBeNull();
    expect(component.form.get('dateRevision')?.value).toBeNull();
  });

  it('should reset the form completely when action is not E', () => {
    component.action = 'C';
    component.form.setValue({
      id: '123',
      name: 'Producto 1',
      description: 'Descripción del Producto 1',
      logo: 'logo.png',
      dateRelease: '2023-10-10',
      dateRevision: '2023-11-10'
    });

    component.resetForm();

    expect(component.form.get('id')?.value).toBe('');
    expect(component.form.get('name')?.value).toBeNull();
    expect(component.form.get('description')?.value).toBeNull();
    expect(component.form.get('logo')?.value).toBeNull();
    expect(component.form.get('dateRelease')?.value).toBeNull();
    expect(component.form.get('dateRevision')?.value).toBeNull();
  });

  it('should set error if id exists', fakeAsync(() => {
    const idControl = component.form.get('id');
    jest.spyOn(productService, 'validateIdProduct').mockReturnValue(of(true));

    component.setupIdFieldValidation();

    idControl?.setValue('123');
    tick(500);

    expect(idControl?.hasError('idExists')).toBe(true);
  }));

  it('should not set error if id does not exist', fakeAsync(() => {
    const idControl = component.form.get('id');
    jest.spyOn(productService, 'validateIdProduct').mockReturnValue(of(false));

    component.setupIdFieldValidation();

    idControl?.setValue('123');
    tick(500);

    expect(idControl?.hasError('idExists')).toBe(false);
  }));

  it('should set fechaRevision one year after fechaLiberacion', () => {
    const control = component.form.get('dateRelease');
    const fechaInicial = new Date(2023, 0, 1);

    const parseDateSpy = jest.spyOn(utilService, 'parseDate').mockReturnValue(fechaInicial);
    const dateFormatSpy = jest.spyOn(utilService, 'dateFormat').mockReturnValue('01/01/2024');

    control?.setValue('01/01/2023');
    component.setDateRevision(control);

    expect(parseDateSpy).toHaveBeenCalledWith('01/01/2023');
    expect(dateFormatSpy).toHaveBeenCalled();
    expect(component.form.get('dateRevision')?.value).toBe('01/01/2024');
  });

  it('should not set fechaRevision if fechaLiberacion is not provided', () => {
    const control = component.form.get('dateRelease');

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
