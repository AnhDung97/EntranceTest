import { TestBed, inject } from '@angular/core/testing';
import { HttpBackend, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { ScreenService } from './screen.service';

describe('Checking ScreenService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [
        ScreenService
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(ScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
