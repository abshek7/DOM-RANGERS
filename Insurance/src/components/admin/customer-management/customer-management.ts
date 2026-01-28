import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/adminservice';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-management.html',
  styleUrl: './customer-management.css'
})
export class CustomerManagement implements OnInit {

  customers:any[] = [];
  agents:any[] = [];
  documents:any[] = [];

  showModal = false;
  selectedCustomer:any = null;
  constructor(private adminService: AdminService, private c: ChangeDetectorRef) {}



  ngOnInit() {
    this.loadCustomers();
    this.loadAgents();
    this.loadDocuments();
  }

  loadCustomers() {
    this.adminService.getCustomers().subscribe((r:any[]) => {
      this.customers = r;
      this.c.detectChanges();
    });
  }

  loadAgents() {
    this.adminService.getAgents().subscribe((r:any[]) => {
      this.agents = r;
      this.c.detectChanges();
    });
  }

  loadDocuments() {
    this.adminService.getDocuments().subscribe((r:any[]) => {
      this.documents = r;
      this.c.detectChanges();
    });
  }

  openCustomer(c:any) {
    this.selectedCustomer = { ...c };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCustomer = null;
  }

  agentName(agentId:string | null) {
    return this.agents.find(a => a.id === agentId)?.id || '-';
  }

  customerDocuments() {
    return this.documents.filter(d => d.customerId === this.selectedCustomer.id);
  }

  updateKyc(status:'Verified' | 'Rejected') {
    this.adminService.updateCustomer(this.selectedCustomer.id, {
      kycStatus: status
    }).subscribe(() => {
      this.loadCustomers();
      this.closeModal();
    });
    this.c.detectChanges();
  }

}
