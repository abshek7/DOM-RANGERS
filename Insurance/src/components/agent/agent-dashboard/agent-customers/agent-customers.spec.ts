import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCustomers } from './agent-customers';

describe('AgentCustomers', () => {
  let component: AgentCustomers;
  let fixture: ComponentFixture<AgentCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCustomers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
