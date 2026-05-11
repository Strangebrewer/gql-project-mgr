export type PubSubConfig = {
  serviceAccountEmail: string;
  audience: string;
};

export default (): PubSubConfig => ({
  serviceAccountEmail: process.env.PUBSUB_SERVICE_ACCOUNT_EMAIL || '',
  audience: process.env.PUBSUB_AUDIENCE || '',
});
