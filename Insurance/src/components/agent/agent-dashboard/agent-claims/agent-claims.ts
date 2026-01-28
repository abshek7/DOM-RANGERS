import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ClaimsService } from '../../../../services/claimsService';
import { ClaimStatusClassPipe } from '../../../../pipes/claim-status-class.pipe';

@Component({
  standalone: true,
  selector: 'agent-claims',
  imports: [RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, ClaimStatusClassPipe],
  templateUrl: './agent-claims.html',
})
export class AgentClaims implements OnInit {
  constructor(public claimsService: ClaimsService) {}

  ngOnInit(): void {
    this.claimsService.loadClaims();
  }
}
