import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfileDataComponent } from './change-profile-data.component';

describe('ChangeProfileDataComponent', () => {
  let component: ChangeProfileDataComponent;
  let fixture: ComponentFixture<ChangeProfileDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeProfileDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProfileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
