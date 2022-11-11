import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength, Min } from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  Price: number;
}
