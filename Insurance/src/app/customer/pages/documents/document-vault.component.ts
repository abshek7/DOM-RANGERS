import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-document-vault',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="document-vault-container">
      <div class="page-header">
        <h1>Document Vault</h1>
        <p>Manage your insurance documents securely</p>
      </div>

      <div class="upload-section">
        <div class="upload-box">
          <span class="upload-icon">📁</span>
          <h3>Upload Documents</h3>
          <p>Drag and drop files here or click to browse</p>
          <button class="btn-primary">Choose Files</button>
        </div>
      </div>

      <div class="documents-list">
        <h2>Your Documents</h2>
        <div class="empty-state">
          <span class="empty-icon">📄</span>
          <h3>No Documents Yet</h3>
          <p>Upload your first document to get started</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .document-vault-container {
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

    .upload-section {
      margin-bottom: 32px;
    }

    .upload-box {
      background: white;
      border: 2px dashed #cbd5e1;
      border-radius: 16px;
      padding: 48px 24px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .upload-box:hover {
      border-color: #3b82f6;
      background: #f8fafc;
    }

    .upload-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 16px;
    }

    .upload-box h3 {
      margin: 0 0 8px;
      font-size: 18px;
      color: #1e293b;
    }

    .upload-box p {
      margin: 0 0 20px;
      font-size: 14px;
      color: #64748b;
    }

    .btn-primary {
      padding: 12px 24px;
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }

    .documents-list {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .documents-list h2 {
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
export class DocumentVaultComponent { }
