export type ProjectEntity = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status?: string;
  dueDate?: string;
};

export type ProjectEntityRead = ProjectEntity & {
  _id?: string;
};
