import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../../../../services/customersService';
import { LucideAngularModule, Mail, Phone, MapPin, User, LoaderCircle } from 'lucide-angular';
import { TitleCasePipe, UpperCasePipe, LowerCasePipe } from '@angular/common';
import { AdminService } from '../../../../services/adminservice';
import { AuthService } from '../../../../app/core/services/auth.service';
@Component({
  selector: 'agent-customers',
  standalone: true,
  imports: [LucideAngularModule, TitleCasePipe, UpperCasePipe, LowerCasePipe],
  templateUrl: './agent-customers.html',
})
export class AgentCustomers implements OnInit {
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly User = User;
  readonly LoaderCircle = LoaderCircle;

  assignedCustomers: any[] = [];
  currentAgent: any;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService,
    private changeDetectorRef:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAssignedCustomers();
  }

  private loadAssignedCustomers(): void {
    this.adminService.getAgents().subscribe((agents: any[]) => {
      const agent = agents.find(
        a => a.userId === this.authService.user?.id
      );

      if (!agent) return;

      this.currentAgent = agent;
      const assignedCustomerIds: string[] = agent.assignedCustomers || [];
      
      if (!assignedCustomerIds.length) {
        this.assignedCustomers = [];
        return;
      }

      this.adminService.getCustomers().subscribe((customers: any[]) => {
        this.assignedCustomers = customers.filter(c =>
          assignedCustomerIds.includes(c.id)
          
        );
        this.changeDetectorRef.detectChanges();
      });
      
    });
  }

  viewDetails(customerId: string): void {
    this.router.navigate(['/agent/agent-customers', customerId]);
  }
}
