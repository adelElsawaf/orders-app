import { IsEnum, IsNotEmpty, IsNumber, IsString ,IsBoolean, IsOptional} from "class-validator";
import { PublishingStatus

 } from "src/product/enums/publishing-status-enum";
export class UpdateProductRequestDto{
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;
  
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    price: number;
  
    @IsEnum(PublishingStatus)
    @IsNotEmpty()
    @IsOptional()
    publishingStatus: PublishingStatus;
  
    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()

    isFeatured: boolean;
}