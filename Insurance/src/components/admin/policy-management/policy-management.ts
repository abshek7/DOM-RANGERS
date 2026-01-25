import {ChangeDetectorRef ,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/adminservice';
import { Policies } from '../../../models/policies';
@Component({
  selector: 'app-policy-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policy-management.html',
  styleUrl: './policy-management.css'
})
export class PolicyManagement implements OnInit {

  policies:Policies[] = [];

  policy:any = {
    id: '',
    name: '',
    type: '',
    premium: 0,
    coverage: 0,
    duration: 0,
    description: '',
    featuresText: ''
  };

  constructor(private adminService: AdminService, private c: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.adminService.getPolicies().subscribe((r:any[]) => {
      this.policies = r;
      this.c.detectChanges()
    });
  }

  addPolicy() {
    const payload = {
      id: this.policy.id,
      name: this.policy.name,
      type: this.policy.type,
      premium: Number(this.policy.premium),
      coverage: Number(this.policy.coverage),
      duration: Number(this.policy.duration),
      description: this.policy.description,
      features: this.policy.featuresText
        .split(',')
        .map((f:string) => f.trim()),
      createdAt: new Date().toISOString().split('T')[0],
      cancellationRequests: [],
      endorsementRequests: []
    };

    this.adminService.addPolicy(payload).subscribe(() => {
      this.loadPolicies();
      this.resetForm();
      this.c.detectChanges()
    });
  }

  resetForm() {
    this.policy = {
      id: '',
      name: '',
      type: '',
      premium: null,
      coverage: null,
      duration: null,
      description: '',
      featuresText: ''
    };
  }

  deletePolicy(id:string) {
    this.adminService.deletePolicy(id).subscribe(() => {
      this.loadPolicies();
      this.c.detectChanges()
    });
  }

}
