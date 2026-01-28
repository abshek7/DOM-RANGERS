import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsManagement } from './claims-management';

describe('ClaimsManagement', () => {
  let component: ClaimsManagement;
  let fixture: ComponentFixture<ClaimsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
