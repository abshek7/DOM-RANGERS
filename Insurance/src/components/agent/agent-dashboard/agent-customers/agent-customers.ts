import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomersService } from '../../../../services/customersService';
import { LucideAngularModule, Mail, Phone, MapPin, User, LoaderCircle } from 'lucide-angular';
import { TitleCasePipe, UpperCasePipe, LowerCasePipe } from '@angular/common';

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

  constructor(public customersService: CustomersService, private router: Router) {}

  ngOnInit(): void {
    this.customersService.loadCustomers();
  }

  viewDetails(customerId: string): void {
    this.router.navigate(['/agent/agent-customers', customerId]);
  }
}
