export type TracerConfig = {
  url: string;
  serviceKey: string;
  service: string;
};

export default (): TracerConfig => ({
  url: process.env.TRACER_URL || '',
  serviceKey: process.env.SERVICE_KEY || '',
  service: process.env.SERVICE || 'gql-project-mgr',
});
