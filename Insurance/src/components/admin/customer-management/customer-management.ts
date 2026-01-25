import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/adminservice';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-management.html',
  styleUrl: './customer-management.css'
})
export class CustomerManagement implements OnInit {

  customers:any[] = [];

  constructor(private adminService: AdminService, private c: ChangeDetectorRef) {}

  ngOnInit() {
    this.adminService.getCustomers().subscribe((r:any[]) => {
      this.customers = r;
      this.c.detectChanges();
    });
  }

}
