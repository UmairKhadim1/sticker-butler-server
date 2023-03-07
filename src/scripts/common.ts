import { EvergreenServer } from '../server';

export async function startServer(): Promise<EvergreenServer> {
  process.env.PORT = '3001';
  const server = new EvergreenServer();
  console.log("common.ts")
  await server.setupMongo();
  return server;
}
