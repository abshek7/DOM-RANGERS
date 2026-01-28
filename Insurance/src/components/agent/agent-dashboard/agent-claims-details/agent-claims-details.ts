import { Component, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe, CurrencyPipe } from '@angular/common';
import { ClaimsService } from '../../../../services/claimsService';
import { Claims } from '../../../../models/claims';

@Component({
  standalone: true,
  selector: 'agent-claims-details',
  templateUrl: './agent-claims-details.html',
  imports: [TitleCasePipe, CurrencyPipe],
})
export class AgentClaimsDetails implements OnInit {
  claimId!: string;

  claim = computed<Claims | undefined>(() => this.claimsService.getById(this.claimId));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public claimsService: ClaimsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.claimId = id;
    this.claimsService.loadClaims();
  }

  update(status: Claims['status']): void {
    const current = this.claim();
    if (!current) return;

    this.claimsService.updateStatus(current.id, status).subscribe();
  }
  goBack(): void {
    this.router.navigate(['/agent/agent-claims']);
  }
}
