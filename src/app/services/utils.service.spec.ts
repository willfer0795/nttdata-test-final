import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { DatePipe } from '@angular/common';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[DatePipe]
    });
    
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format the date correctly', () => {
      const result = service.formatDate('2023-10-10', 'yyyy-MM-dd');
      expect(result).toBe('2023-10-10');
    });
  
    it('should format the date correctly', () => {
      const result = service.formatDate('', 'yyyy-MM-dd');
      expect(result).toBe('');
    });
  
    it('should convert the date correctly', () => {
      const result = service.convertDate('10/10/2023');
      expect(result).toBe('2023-10-10');
    });
});
