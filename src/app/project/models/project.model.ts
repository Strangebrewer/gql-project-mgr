import { ArgsType, Directive, Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

registerEnumType(ProjectStatus, { name: 'ProjectStatus' });

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix.
// Exception: enum fields require explicit @Field() decorators.

@ObjectType()
@Directive('@key(fields: "id")')
export class Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;
  dueDate?: string;
}

@ArgsType()
export class CreateProjectArgs {
  name: string;
  description?: string;
  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;
  dueDate?: string;
}

@ArgsType()
export class UpdateProjectArgs {
  name?: string;
  description?: string;
  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;
  dueDate?: string;
}
