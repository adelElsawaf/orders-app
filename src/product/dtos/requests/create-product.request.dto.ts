import { IsEnum, IsNotEmpty, IsNumber, IsString ,IsBoolean} from "class-validator";
import { PublishingStatus } from "../../enums/publishing-status-enum";

export class CreateProductRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(PublishingStatus)
  @IsNotEmpty()
  publishingStatus: PublishingStatus;

  @IsBoolean()
  @IsNotEmpty()
  isFeatured: boolean;
}