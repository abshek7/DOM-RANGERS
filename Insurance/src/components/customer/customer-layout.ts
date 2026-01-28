import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
    label: string;
    route: string;
    icon: string;
}

@Component({
    selector: 'app-customer-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './customer-layout.html'
})
export class CustomerLayoutComponent implements OnInit {
    customerName: string = 'Insurance User';
    customerId: string = 'CUST-001';
    showProfileMenu: boolean = false;

    menuItems: MenuItem[] = [
        { label: 'Dashboard', route: '/customer/dashboard', icon: '' },
        { label: 'Browse Policies', route: '/customer/marketplace', icon: '' },
        { label: 'My Policies', route: '/customer/my-policies', icon: '' },
        { label: 'My Claims', route: '/customer/claims', icon: '' },
        { label: 'Profile', route: '/customer/profile', icon: '' }
    ];

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    toggleProfileMenu(): void {
        this.showProfileMenu = !this.showProfileMenu;
    }

    logout(): void {
        this.router.navigate(['/']);
    }

    isActive(route: string): boolean {
        return this.router.url.startsWith(route);
    }
}
