export interface Document {
  id: string;
  fileName: string;
  type: string;
  uploadedDate: string;
  verified: boolean;
  customerId: string;
  isGlobal: boolean;
  filePath?: string;
}
