import { AbstractControl } from '@angular/forms';
import { from, of, throwError } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { CustomValidators } from './custom-validators';

describe('CustomValidators', () => {
  let productoService: ProductosService;

  beforeEach(() => {
    productoService = {
      validateIdProduct: jest.fn()
    } as any;
  });

  describe('idValidator', () => {
    it('should return { idExists: true } if the id exists', () => {
      const control = { value: '123' } as AbstractControl;
      jest.spyOn(productoService, 'validateIdProduct').mockReturnValue(of(true));

      const validator = CustomValidators.idValidator(productoService);
      from(validator(control)).subscribe(result => {
        expect(result).toEqual({ idExists: true });
      });

    });

    it('should return null if the id does not exist', () => {
        const control = { value: '123' } as AbstractControl;
        jest.spyOn(productoService, 'validateIdProduct').mockReturnValue(of(false));
  
        const validator = CustomValidators.idValidator(productoService);
        from(validator(control)).subscribe(result => {
          expect(result).toBeNull();
        });
      });

      it('should return null if there is an error', () => {
        const control = { value: '123' } as AbstractControl;
        jest.spyOn(productoService, 'validateIdProduct').mockReturnValue(throwError('error'));
  
        const validator = CustomValidators.idValidator(productoService);
        from(validator(control)).subscribe(result => {
          expect(result).toBeNull();
        });
      });
  });
});