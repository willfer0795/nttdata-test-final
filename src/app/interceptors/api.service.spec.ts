import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ApiInterceptor } from './api.service';
import { environment } from 'src/environments/environment';

describe('ApiInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add the base URL to the request', () => {
    const testUrl = '/test-endpoint';
    const expectedUrl = environment.urlBase + testUrl;

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.url).toBe(expectedUrl);
  });
});