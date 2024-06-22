import { TestBed } from '@angular/core/testing';

import { TabacchiService } from './tabacchi.service';

describe('TabacchiService', () => {
  let service: TabacchiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabacchiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
