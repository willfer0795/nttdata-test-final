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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should navigate to list products on return', () => {
    component.return();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('productos/listar-productos');
  });


});


