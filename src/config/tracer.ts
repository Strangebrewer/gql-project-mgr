export type TracerConfig = {
  url: string;
  serviceKey: string;
  service: string;
};

export default (): TracerConfig => ({
  url: process.env.TRACER_SERVICE_URL || '',
  serviceKey: process.env.TRACER_SERVICE_KEY || '',
  service: process.env.SERVICE || 'gql-project-mgr',
});
