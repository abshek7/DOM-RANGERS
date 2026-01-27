import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../../../services/customersService';
import { CommonModule } from '@angular/common';

import { LucideAngularModule, Mail, Phone, MapPin, User, LoaderCircle } from 'lucide-angular';

@Component({
  selector: 'agent-customers',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './agent-customers.html',
})
export class AgentCustomers implements OnInit {
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly User = User;
  readonly LoaderCircle = LoaderCircle;

  constructor(public customersService: CustomersService) {}

  ngOnInit(): void {
    this.customersService.loadCustomers();
  }
}
