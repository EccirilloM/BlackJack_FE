import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeMoneyComponent } from './charge-money.component';

describe('ChargeMoneyComponent', () => {
  let component: ChargeMoneyComponent;
  let fixture: ComponentFixture<ChargeMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeMoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
