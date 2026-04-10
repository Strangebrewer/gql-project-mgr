export type ProjectEntity = {
  id: string;
  thing: string;
  userId: string;
};

export type ProjectEntityRead = ProjectEntity & {
  _id?: string;
};
