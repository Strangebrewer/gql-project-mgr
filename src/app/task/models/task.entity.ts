export type TaskEntity = {
  id: string;
  userId: string;
  projectId: string;
  name: string;
  description?: string;
  status?: string;
  dueDate?: string;
};

export type TaskEntityRead = TaskEntity & {
  _id?: string;
};
