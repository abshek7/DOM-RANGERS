import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClaimsService } from '../../../../services/claimsService';
import { Claims } from '../../../../models/claims';

@Component({
  standalone: true,
  selector: 'agent-claims-details',
  imports: [CommonModule],
  templateUrl: './agent-claims-details.html',
})
export class AgentClaimsDetails implements OnInit {
  claimId!: string;

  claim = computed<Claims | undefined>(() => this.claimsService.getById(this.claimId));

  constructor(private route: ActivatedRoute, public claimsService: ClaimsService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.claimId = id;
    this.claimsService.loadClaims();
  }

  update(status: 'approved' | 'rejected'): void {
    const currentClaim = this.claim();
    if (!currentClaim) return;

    this.claimsService.updateStatus(currentClaim.id, status).subscribe(() => {
      currentClaim.status = status;
    });
  }
}
