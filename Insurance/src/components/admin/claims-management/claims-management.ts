import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/adminservice';
import { Claims } from '../../../models/claims';
@Component({
  selector: 'app-claims-management',
  imports: [CommonModule],
  templateUrl: './claims-management.html',
  styleUrl: './claims-management.css',
})
export class ClaimsManagement implements OnInit {

  claims: Claims[] = [];

  constructor(private adminService: AdminService ,private c: ChangeDetectorRef) {}

  ngOnInit() {
    this.adminService.getClaims().subscribe((r:Claims[]) => {
      this.claims = r;
        this.c.detectChanges()
    });
  }

  updateStatus(claim:Claims, status:any) {
    const updated = { ...claim, status };
    this.adminService.updateClaim(updated).subscribe(() => {
      claim.status = status;
        this.c.detectChanges()
    });
  }

}
