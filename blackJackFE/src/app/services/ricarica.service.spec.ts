import { TestBed } from '@angular/core/testing';

import { RicaricaService } from './ricarica.service';

describe('RicaricaService', () => {
  let service: RicaricaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RicaricaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
