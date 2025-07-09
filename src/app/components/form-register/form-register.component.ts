import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { IProduct } from '../../interfaces/product.interface';
import { debounceTime } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss']
})
export class FormRegisterComponent implements OnInit {
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  @Input() action:string = '';
  @Input() editProduct:IProduct = {};

  form:any;
  initialDateRelease: string = '';
  minimumDate: string = '';
  loadingButton: boolean = false;

  constructor( private readonly formBuilder: FormBuilder,
      private readonly productService:ProductsService,
      private readonly router:Router,
      private readonly utilsService: UtilsService
    ) {         
      }

  ngOnInit(): void {
    this.initialDateRelease = this.editProduct?.date_release ?? '';
    this.initializeForm();
    this.setupIdFieldValidation();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      id: [{ 
        value: this.action === 'E' ? this.editProduct.id : '', 
        disabled: this.action === 'E'
      }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: [this.action === 'E' ? this.editProduct.name : '', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [this.action === 'E' ? this.editProduct.description : '', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [this.action === 'E' ? this.editProduct.logo : '', Validators.required],
      dateRelease: [this.action === 'E' ? this.editProduct.date_release : '', [Validators.required, this.dateReleaseValidator.bind(this)]],
      dateRevision: [{ value: this.action === 'E' ? this.editProduct.date_revision : '', disabled: true }, [Validators.required]]
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
  
    const today = this.action === 'C' || initialDate >= new Date() ? new Date() : initialDate;
  
    const dateReleaseWHour = this.utilsService.removeTime(dateRelease);
    const todayWHour = this.utilsService.removeTime(today);
  
    this.minimumDate = this.utilsService.dateFormat(todayWHour);
  
    const isValid = dateReleaseWHour >= todayWHour;
    if (isValid) {
      this.setDateRevision(control);
    }
  
    return isValid ? null : { invalidDateRelease: true };
  }

  setDateRevision(control: any) {
    const dateReleaseValue = control.value;
    if (!dateReleaseValue) {
      return;
    }
    const dateRelease = this.utilsService.parseDate(dateReleaseValue);
    dateRelease.setFullYear(dateRelease.getFullYear() + 1);
    const newDateRevision = this.utilsService.dateFormat(dateRelease);
  
    this.form.patchValue({
      dateRevision: newDateRevision
    });
  }

  onSubmit(customerData: any): void {
    const objSend = {
      id: this.action === 'E' ? this.editProduct.id : customerData.id,
      name: customerData.name,
      description: customerData.description,
      logo: customerData.logo,
      date_release: customerData.dateRelease,
      date_revision: this.form.get('dateRevision')?.value
    };

    const action$ = this.action === 'C' 
      ? this.productService.postProduct(objSend)
      : this.productService.updateProduct(objSend, this.editProduct.id);

    this.loadingButton = true;
    action$.subscribe({
      next: () => {
        this.showSuccess()
        setTimeout(() => {
          this.router.navigateByUrl("products/list-products");
        }, 1500);
      },
      error: error => {
        this.showError(error.message)
        this.loadingButton = false;
      }
    });
  }

  resetForm = () => {
    const idValue = this.form.get('id')?.value;
    this.form.reset({
      id: this.action === 'E' ? idValue : ''
    });

  }

  showSuccess() {
    this.toastComponent.showToast('Operation Successful!', 'success');
  }

  showError(error:any) {
    this.toastComponent.showToast(error, 'error');
  }

}
