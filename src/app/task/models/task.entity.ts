export type TaskEntity = {
  _id: string;
  userId: string;
  projectId: string;
  name: string;
  description?: string;
  status?: string;
  dueDate?: string;
  expiresAt?: Date;
};
