import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClaimsService } from '../../../../services/claimsService';

@Component({
  standalone: true,
  selector: 'agent-claims',
  imports: [RouterLink],
  templateUrl: './agent-claims.html',
})
export class AgentClaims implements OnInit {
  constructor(public claimsService: ClaimsService) {}

  ngOnInit(): void {
    this.claimsService.loadClaims('AGT-001');
  }
}
