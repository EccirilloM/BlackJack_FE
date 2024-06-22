import { TestBed } from '@angular/core/testing';

import { EconomoGuard } from './economo.guard';

describe('EconomoGuard', () => {
  let guard: EconomoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EconomoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
