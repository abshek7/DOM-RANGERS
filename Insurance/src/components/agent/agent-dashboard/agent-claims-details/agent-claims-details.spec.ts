import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentClaimsDetails } from './agent-claims-details';

describe('AgentClaimsDetails', () => {
  let component: AgentClaimsDetails;
  let fixture: ComponentFixture<AgentClaimsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentClaimsDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentClaimsDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
