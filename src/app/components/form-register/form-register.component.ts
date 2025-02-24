import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { CustomValidators } from '../../validator/custom-validators';
import { IProduct } from '../../interfaces/product.interface';
import { debounceTime } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss']
})
export class FormRegisterComponent implements OnInit {

  @Input() accion:string = '';
  @Input() editProduct:IProduct = {};

  form:any;
  initialDateRelease: string = '';
  fechaMinima: string = '';

  constructor( private formBuilder: FormBuilder,
      private productService:ProductosService,
      private router:Router,
      private utilsService: UtilsService
    ) {         
      }

  ngOnInit(): void {
    // Guardar el valor inicial de date_release
    this.initialDateRelease = this.editProduct?.date_release || '';
    this.initializeForm();
    this.setupIdFieldValidation();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      id: [{ 
        value: this.accion === 'E' ? this.editProduct.id : '', 
        disabled: this.accion === 'E'
      }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      nombre: [this.accion === 'E' ? this.editProduct.name : '', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: [this.accion === 'E' ? this.editProduct.description : '', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [this.accion === 'E' ? this.editProduct.logo : '', Validators.required],
      fechaLiberacion: [this.accion === 'E' ? this.editProduct.date_release : '', [Validators.required, this.fechaLiberacionValidator.bind(this)]],
      fechaRevision: [{ value: this.accion === 'E' ? this.editProduct.date_revision : '', disabled: true }, [Validators.required]]
    });
  }

  setupIdFieldValidation(): void {
    const idControl = this.form.get('id');
    if (idControl) {
      idControl.valueChanges.pipe(
        debounceTime(500),
      ).subscribe(() => {
        if (idControl.value) {
          this.productService.validateIdProduct(idControl.value)
          .subscribe(validationResult => {
            if (validationResult) {
              idControl.setErrors({ idExists: true }); 
            } else {
              idControl.setErrors(null);
            }
          });
        }
        
      });
    }
  }

  private fechaLiberacionValidator(control: any): { [key: string]: boolean } | null {
    if (!this.form) {
      return null;
    }
    const fechaLiberacion = this.utilsService.parseDate(control.value);
    const initialDate = this.utilsService.parseDate(this.initialDateRelease);
  
    const hoy = this.accion === 'C' || initialDate >= new Date() ? new Date() : initialDate;
  
    const fechaLiberacionSinHora = this.utilsService.removeTime(fechaLiberacion);
    const hoySinHora = this.utilsService.removeTime(hoy);
  
    this.fechaMinima = this.utilsService.formatearFecha(hoySinHora);
  
    const isValid = fechaLiberacionSinHora >= hoySinHora;
    if (isValid) {
      this.setFechaRevision(control);
    }
  
    return isValid ? null : { invalidFechaLiberacion: true };
  }

  setFechaRevision (control: any) {
    const fechaLiberacionValor = control.value;
    if (!fechaLiberacionValor) {
      return;
    }
    const fechaLiberacionDate = this.utilsService.parseDate(fechaLiberacionValor);
    fechaLiberacionDate.setFullYear(fechaLiberacionDate.getFullYear() + 1);
    const nuevaFechaRevision = this.utilsService.formatearFecha(fechaLiberacionDate);
  
    this.form.patchValue({
      fechaRevision: nuevaFechaRevision
    });
  }

  onSubmit(customerData: any): void {
    const objSend = {
      id: this.accion === 'E' ? this.editProduct.id : customerData.id,
      name: customerData.nombre,
      description: customerData.descripcion,
      logo: customerData.logo,
      date_release: customerData.fechaLiberacion,
      date_revision: this.form.get('fechaRevision')?.value
    };

    const action$ = this.accion === 'C' 
      ? this.productService.postProduct(objSend)
      : this.productService.updateProduct(objSend, this.editProduct.id);

    action$.subscribe({
      next: () => {
        this.router.navigateByUrl("productos/listar-productos");
      },
      error: error => console.error('Hubo un error:', error)
    });
  }

  resetForm = () => {
    const idValue = this.form.get('id')?.value;
    this.form.reset({
      id: this.accion === 'E' ? idValue : ''
    });

  }

}
