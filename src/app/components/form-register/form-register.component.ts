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
  minimumDate: string = '';

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
      fechaLiberacion: [this.accion === 'E' ? this.editProduct.date_release : '', [Validators.required, this.dateReleaseValidator.bind(this)]],
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

  private dateReleaseValidator(control: any): { [key: string]: boolean } | null {
    if (!this.form) {
      return null;
    }
    const dateRelease = this.utilsService.parseDate(control.value);
    const initialDate = this.utilsService.parseDate(this.initialDateRelease);
  
    const today = this.accion === 'C' || initialDate >= new Date() ? new Date() : initialDate;
  
    const dateReleaseWHour = this.utilsService.removeTime(dateRelease);
    const todayWHour = this.utilsService.removeTime(today);
  
    this.minimumDate = this.utilsService.formatearFecha(todayWHour);
  
    const isValid = dateReleaseWHour >= todayWHour;
    if (isValid) {
      this.setDateRevision(control);
    }
  
    return isValid ? null : { invalidFechaLiberacion: true };
  }

  setDateRevision(control: any) {
    const dateReleaseValue = control.value;
    if (!dateReleaseValue) {
      return;
    }
    const dateRelease = this.utilsService.parseDate(dateReleaseValue);
    dateRelease.setFullYear(dateRelease.getFullYear() + 1);
    const newDateRevision = this.utilsService.formatearFecha(dateRelease);
  
    this.form.patchValue({
      fechaRevision: newDateRevision
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
