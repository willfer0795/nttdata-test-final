import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductosService } from 'src/app/services/productos.service';


export class CustomValidators {
  static idValidator(productoService: ProductosService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return productoService.validateIdProduct(control.value).pipe(
        map(resp => {
          return resp ? { idExists: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }
}
