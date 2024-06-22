import { TestBed } from '@angular/core/testing';

import { ManoService } from './mano.service';

describe('ManoService', () => {
  let service: ManoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
