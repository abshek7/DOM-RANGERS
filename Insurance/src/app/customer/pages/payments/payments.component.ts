import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-payments',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="payments-container">
      <div class="page-header">
        <h1>Payment History</h1>
        <p>View all your payment transactions</p>
      </div>

      <div class="payment-summary">
        <div class="summary-card">
          <h3>Total Paid</h3>
          <p class="amount">₹27,000</p>
        </div>
        <div class="summary-card">
          <h3>Pending Payments</h3>
          <p class="amount pending">₹0</p>
        </div>
      </div>

      <div class="payments-list">
        <h2>Recent Transactions</h2>
        <div class="empty-state">
          <span class="empty-icon">💰</span>
          <h3>No Payments Yet</h3>
          <p>Your payment history will appear here</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .payments-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header h1 {
      margin: 0 0 8px;
      font-size: 32px;
      color: #1e293b;
      font-weight: 700;
    }

    .page-header p {
      margin: 0 0 32px;
      font-size: 16px;
      color: #64748b;
    }

    .payment-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .summary-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .summary-card h3 {
      margin: 0 0 12px;
      font-size: 14px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .summary-card .amount {
      margin: 0;
      font-size: 32px;
      color: #047857;
      font-weight: 700;
    }

    .summary-card .amount.pending {
      color: #f59e0b;
    }

    .payments-list {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .payments-list h2 {
      margin: 0 0 20px;
      font-size: 20px;
      color: #1e293b;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
    }

    .empty-icon {
      font-size: 64px;
      display: block;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 8px;
      font-size: 18px;
      color: #1e293b;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }
  `]
})
export class PaymentsComponent { }
