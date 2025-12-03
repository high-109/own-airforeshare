export enum ItemType {
  TEXT = 'TEXT',
  LINK = 'LINK',
  FILE = 'FILE',
  CODE = 'CODE',
}

export interface SharedItem {
  id: string;
  type: ItemType;
  content: string; // Text content or Base64 data for small files
  fileName?: string; // Only for files
  fileSize?: string; // Human readable size
  mimeType?: string;
  createdAt: number;
  expiresAt: number;
  networkId: string;
  aiSummary?: string; // Optional AI enhancement
}

export interface NetworkStatus {
  ip: string; // Simulated IP
  deviceCount: number;
  networkId: string;
}

export interface AiEnhanceResult {
  formattedContent: string;
  type: ItemType;
  summary?: string;
}