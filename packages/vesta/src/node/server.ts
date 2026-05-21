export interface ServerDefinition {
  fetch(request: Request): Response | Promise<Response>;
}

export function defineServer<T extends ServerDefinition>(server: T): T {
  return server;
}
