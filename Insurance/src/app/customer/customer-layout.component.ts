import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Notification } from '../../models';

@Component({
    selector: 'app-customer-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './customer-layout.component.html',
    styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent implements OnInit {
    customerName: string = 'Customer';
    customerId: string = 'CUST-001';
    notifications: Notification[] = [];
    unreadCount: number = 0;
    showNotifications: boolean = false;
    showProfileMenu: boolean = false;

    menuItems = [
        { icon: '🏠', label: 'Home Dashboard', route: '/customer/dashboard', id: 'dashboard' },
        { icon: '🔍', label: 'Browse Policies', route: '/customer/marketplace', id: 'marketplace' },
        { icon: '📄', label: 'My Policies', route: '/customer/my-policies', id: 'policies' },
        { icon: '⚠️', label: 'My Claims', route: '/customer/claims', id: 'claims' }
    ];

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.loadUserData();
        this.loadNotifications();
    }

    loadUserData(): void {
        const user = localStorage.getItem('currentUser');
        if (user) {
            const userData = JSON.parse(user);
            this.customerName = userData.name || 'Customer';
            this.customerId = userData.customerId || 'CUST-001';
        }
    }

    loadNotifications(): void {
        // Mock notifications - in real app, fetch from service
        this.notifications = [
            {
                id: '1',
                type: 'info',
                title: 'Premium Due',
                message: 'Your health insurance premium is due in 5 days',
                timestamp: new Date().toISOString(),
                read: false
            },
            {
                id: '2',
                type: 'success',
                title: 'Claim Approved',
                message: 'Your recent claim has been approved',
                timestamp: new Date().toISOString(),
                read: false
            }
        ];
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;
        this.showProfileMenu = false;
    }

    toggleProfileMenu(): void {
        this.showProfileMenu = !this.showProfileMenu;
        this.showNotifications = false;
    }

    markAsRead(notification: Notification): void {
        notification.read = true;
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
    }

    isActive(route: string): boolean {
        return this.router.url === route;
    }
}
