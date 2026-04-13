import { Directive, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@shareable')
export class DeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}
