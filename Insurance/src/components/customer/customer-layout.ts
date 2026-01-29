import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/core/services/auth.service';
import { AdminService } from '../../services/adminservice';

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
    customerId: string = '';
    showProfileMenu: boolean = false;

    menuItems: MenuItem[] = [
        { label: 'Dashboard', route: '/customer/dashboard', icon: '' },
        { label: 'Policy Catalog', route: '/customer/policy-catalog', icon: '' },
        { label: 'My Policies', route: '/customer/my-policies', icon: '' },
        { label: 'My Claims', route: '/customer/claims', icon: '' },
        { label: 'Profile', route: '/customer/profile', icon: '' }
    ];

    constructor(private router: Router, private authService: AuthService, private adminService: AdminService,
        private ChangeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.adminService.getCustomers().subscribe((customers) => {
            const customer = customers.find(c => c.userId === this.authService.user?.id);
            console.log(customer);
            if (customer) {
                this.customerId = customer.id;
            }
            this.ChangeDetectorRef.detectChanges();
        });
    }

    toggleProfileMenu(): void {
        this.showProfileMenu = !this.showProfileMenu;
    }

    logout(): void {
        this.router.navigate(['/']);
        this.authService.logout();
    }

    isActive(route: string): boolean {
        return this.router.url.startsWith(route);
    }
}
