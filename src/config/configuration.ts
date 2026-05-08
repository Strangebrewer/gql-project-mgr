import app from './app';
import database from './database';
import tracer from './tracer';

export default () => ({
  app: app(),
  database: database(),
  tracer: tracer(),
});
