import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle HTTP error responses', () => {
    const errorMessage = 'Error Code: 404\nMessage: Not Found';

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle client-side error events', () => {
    const errorEvent = new ErrorEvent('Network error', {
      message: 'No Internet',
    });

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with a client-side error'),
      error: (error) => {
        expect(error.message).toBe('Error: No Internet');
      }
    });

    const req = httpMock.expectOne('/test');
    req.error(errorEvent);
  });
});