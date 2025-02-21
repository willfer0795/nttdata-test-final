import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { CustomValidators } from '../../validator/custom-validators';
import { IProduct } from '../../interfaces/product.interface';

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

  constructor( private formBuilder: FormBuilder,
      private productService:ProductosService,
      private router:Router) {         
      }

  ngOnInit(): void {
    // Guardar el valor inicial de date_release
    this.initialDateRelease = this.editProduct?.date_release || '';

    this.form = this.formBuilder.group({
      id: [{value: this.accion === 'E' ? this.editProduct.id  : '', disabled: this.accion === 'E'}, [Validators.required, Validators.minLength(3), Validators.maxLength(10)],[CustomValidators.idValidator(this.productService)]],
      nombre: [this.accion === 'E' ? this.editProduct.name  : '', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: [this.accion === 'E' ? this.editProduct.description: '' , [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [this.accion === 'E' ? this.editProduct.logo: '' , Validators.required],
      fechaLiberacion: [this.accion === 'E' ? this.editProduct.date_release: '', [Validators.required, this.fechaLiberacionValidator.bind(this)]],
      fechaRevision: [this.accion === 'E' ? this.editProduct.date_revision: '', [Validators.required, this.fechaRevisionValidator]]
    });
    if (this.accion === 'E') {
      this.form.markAllAsTouched();
    }
  }

  fechaLiberacionValidator(control: any) {
    if (!this.form) {
      return null;
    }
    const fechaLiberacion = new Date(control.value + ' 00:00:00');
    let hoyTemp: Date = new Date();
    let hoy: Date;
    let initialDate = new Date(this.initialDateRelease + ' 00:00:00');
    if (this.accion === 'C') {
      hoy = new Date();
    } else {
      if (initialDate >=  hoyTemp ) {
        hoy = new Date();
      } else {
        hoy = initialDate;
      }
    }

    // Paso 4: Comparar las partes de la fecha (año, mes y día)
    const fechaLiberacionSinHora = new Date(fechaLiberacion.getFullYear(), fechaLiberacion.getMonth(), fechaLiberacion.getDate());
    
    const hoySinHora =  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    
    if (this.accion === 'E') {
      const fechaRevisionControl = this.form.get('fechaRevision');
      if (fechaRevisionControl) {
        const fechaRevisionErrors = this.fechaRevisionValidator(fechaRevisionControl);
        fechaRevisionControl.setErrors(fechaRevisionErrors);
      }
    }
    return fechaLiberacionSinHora >= hoySinHora ? null : { invalidFechaLiberacion: true };
    
  }

  
  fechaRevisionValidator = (control: any) => {
    if (!this.form) {
      return null;
    }

    const fechaLiberacion = new Date(this.form.get('fechaLiberacion')?.value);
    const fechaRevision = new Date(control.value);
    const unAnioDespues = new Date(fechaLiberacion);
    unAnioDespues.setFullYear(unAnioDespues.getFullYear() + 1);

    return fechaRevision.getTime() === unAnioDespues.getTime() ? null : { invalidFechaRevision: true };
  }

  onSubmit(customerData:any) {

    let objSend = {
      "id": this.accion === 'E' ? this.editProduct.id : customerData.id,
      "name": customerData.nombre,
      "description": customerData.descripcion,
      "logo": customerData.logo,
      "date_release": customerData.fechaLiberacion,
      "date_revision": customerData.fechaRevision
     }

    if (this.accion === 'C') {
      this.productService.postProduct(objSend)
      .subscribe(resp =>{
        this.router.navigateByUrl("productos/listar-productos")
      });
    } else {
      this.productService.updateProduct(objSend, this.editProduct.id )
      .subscribe(resp =>{
        this.router.navigateByUrl("productos/listar-productos")
      });
    }
  }

  resetForm = () => {
    const idValue = this.form.get('id')?.value;
    if (this.accion === 'E') {
      this.form.reset({
        id: idValue
      });
      this.form.get('id')?.disable();
    } else {
      this.form.reset();
    }
  }

}
