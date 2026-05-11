import { Directive, Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

registerEnumType(TaskStatus, { name: 'TaskStatus' });

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix.
// Exception: enum fields require explicit @Field() decorators.

@ObjectType()
@Directive('@key(fields: "id")')
export class Task {
  id: string;
  userId: string;
  projectId: string;
  name: string;
  description?: string;
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;
  dueDate?: string;
}

@InputType()
export class CreateTaskInput {
  projectId: string;
  name: string;
  description?: string;
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;
  dueDate?: string;
}

@InputType()
export class UpdateTaskInput {
  name?: string;
  description?: string;
  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;
  dueDate?: string;
}
