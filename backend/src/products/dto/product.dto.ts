import { IsString, IsNumber, IsArray, IsOptional, IsMongoId } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsMongoId()
  category: string;

  @IsMongoId()
  vendor: string;

  @IsNumber()
  stock: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  specifications?: any[];

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsArray()
  @IsOptional()
  reviews?: any[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  specifications?: any[];

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsArray()
  @IsOptional()
  reviews?: any[];
}
