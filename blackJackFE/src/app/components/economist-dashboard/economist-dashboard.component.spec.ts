import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomistDashboardComponent } from './economist-dashboard.component';

describe('EconomoDashboardComponent', () => {
  let component: EconomistDashboardComponent;
  let fixture: ComponentFixture<EconomistDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomistDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomistDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
