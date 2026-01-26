import { Injectable } from '@angular/core';
import { Document } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly STORAGE_KEY = 'customer_documents';

  constructor() { }

  getDocuments(customerId: string): Document[] {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    return all[customerId] || [];
  }

  saveDocument(customerId: string, document: Omit<Document, 'id'>): Document {
    const doc: Document = {
      ...document,
      id: `doc_${Date.now()}`
    };

    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    if (!all[customerId]) {
      all[customerId] = [];
    }
    all[customerId].push(doc);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));

    return doc;
  }

  deleteDocument(customerId: string, docId: string): void {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    if (all[customerId]) {
      all[customerId] = all[customerId].filter((d: Document) => d.id !== docId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    }
  }

  verifyDocument(customerId: string, docId: string, verified: boolean): void {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    if (all[customerId]) {
      const doc = all[customerId].find((d: Document) => d.id === docId);
      if (doc) {
        doc.verified = verified;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
      }
    }
  }

  getDocumentsByType(customerId: string, type: string): Document[] {
    return this.getDocuments(customerId).filter(d => d.type === type);
  }

  clearDocuments(customerId: string): void {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    delete all[customerId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  }
}
