export type DatabaseConfig = {
  uri?: string;
  username: string;
  password: string;
  cluster: string;
  name: string;
  collections: {
    project: string;
    task: string;
  };
};

export default (): DatabaseConfig => ({
  uri: process.env.MONGO_URI || undefined,
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  cluster: process.env.DB_CLUSTER || '',
  name: process.env.DB_NAME || '',
  collections: {
    project: process.env.PROJECTS_COLLECTION || 'projects',
    task: process.env.TASKS_COLLECTION || 'tasks',
  },
});
