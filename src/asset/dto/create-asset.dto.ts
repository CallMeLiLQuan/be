export class CreateAssetDto {
  name: string;
  type: string;
  status: string;
  location: string;
  description?: string;
  purchaseDate?: string;
  value?: number;
  assignedTo?: number;
  category: string;
} 