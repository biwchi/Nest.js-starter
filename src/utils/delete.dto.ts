import { ArrayNotEmpty, IsNumber } from 'class-validator';

export class DeleteDto {
  /**
   * Entities IDs for delete
   * @example [1, 2, 3]
   */
  @ArrayNotEmpty()
  @IsNumber({}, { each: true, message: 'Should be number' })
  ids: number[];
}
