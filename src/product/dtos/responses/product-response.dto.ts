import { PublishingStatus } from '../../enums/publishing-status-enum';

export class ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  publishingStatus: PublishingStatus;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
