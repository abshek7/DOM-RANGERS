import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Policy, PolicyFilter } from '../../../../models/policies';
import { PolicyService } from '../../../services/policy.service';

@Component({
    selector: 'app-marketplace',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './marketplace.component.html',
    styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {
    policies: Policy[] = [];
    filteredPolicies: Policy[] = [];
    loading: boolean = true;
    searchTerm: string = '';
    selectedType: string = 'all';

    // Updated to match db.json policy types
    policyTypes = ['all', 'health', 'life', 'vehicle', 'travel'];

    constructor(private policyService: PolicyService) { }

    ngOnInit(): void {
        this.loadPolicies();
    }

    loadPolicies(): void {
        this.loading = true;
        this.policyService.getAllPolicies().subscribe({
            next: (policies) => {
                this.policies = policies;
                this.filteredPolicies = [...policies];
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading policies:', error);
                this.loading = false;
                // Fallback to empty array on error
                this.policies = [];
                this.filteredPolicies = [];
            }
        });
    }

    filterPolicies(): void {
        this.filteredPolicies = this.policies.filter(policy => {
            const matchesSearch = policy.policyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                policy.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesType = this.selectedType === 'all' || policy.type === this.selectedType;
            return matchesSearch && matchesType;
        });
    }

    onSearchChange(): void {
        this.filterPolicies();
    }

    onTypeChange(): void {
        this.filterPolicies();
    }

    getStarArray(rating: number): number[] {
        return Array(Math.floor(rating)).fill(0);
    }
}
