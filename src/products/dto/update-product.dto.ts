import { IsNotEmpty, IsNumber, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDTO {
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  Price: number;
}
