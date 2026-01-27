import { Component, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../../../services/customersService';
import { Customer } from '../../../../models/customers';
import { TitleCasePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'agent-customer-details',
  templateUrl: './agent-customer-details.html',
  imports: [TitleCasePipe],
})
export class AgentCustomerDetails implements OnInit {
  customerId!: string;

  customer = computed<Customer | undefined>(() =>
    this.customersService.getCustomerById(this.customerId)
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.customerId = id;
    this.customersService.loadCustomerById(id);
  }

  goBack(): void {
    this.router.navigate(['/agent/agent-customers']);
  }
}
