import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Policy } from '../../../../models/policies';
import { PolicyService } from '../../../../services/policyservice';

@Component({
    selector: 'app-marketplace',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, TitleCasePipe],
    templateUrl: './marketplace.html'
})
export class MarketplaceComponent implements OnInit {
    policies: Policy[] = [];
    filteredPolicies: any[] = [];
    loading: boolean = true;
    searchTerm: string = '';
    selectedType: string = 'all';
    policyTypes = ['all', 'health', 'life', 'vehicle', 'travel'];
    age: number = 25;

    constructor(
        private policyService: PolicyService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadPolicies();
    }

    loadPolicies(): void {
        this.loading = true;
        this.policyService.getAllPolicies().subscribe({
            next: (policies) => {
                this.policies = policies;
                this.applyFilters();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getAgeFactor(age: number): number {
        if (age <= 25) return 1.0;
        if (age <= 35) return 1.2;
        return 1.5;
    }

    applyFilters(): void {
        const factor = this.getAgeFactor(this.age);

        this.filteredPolicies = this.policies
            .filter(p => {
                const matchesSearch = !this.searchTerm ||
                    p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(this.searchTerm.toLowerCase());
                const matchesType = this.selectedType === 'all' || p.type === this.selectedType;

                return matchesSearch && matchesType;
            })
            .map(p => ({
                ...p,
                recalculatedPremium: Math.round(p.premium * factor)
            } as any));
        this.cdr.detectChanges();
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.selectedType = 'all';
        this.age = 25;
        this.applyFilters();
    }
}
