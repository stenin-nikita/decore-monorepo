import type { IncomingMessage, ServerResponse } from 'node:http';

import { NodeRequest, sendNodeResponse } from 'srvx/node';
import type { Connect } from 'vite';

import type { ServerDefinition } from '../../../node/server';
import type { Runner } from './runner';

export interface ServerModule {
  default?: ServerDefinition;
}

export function createMiddleware(runner: Runner, entrypoint: string) {
  return async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
    try {
      const request = new NodeRequest({ req, res });
      const mod = await runner.import<ServerModule>(entrypoint);

      if (!mod.default || typeof mod.default.fetch !== 'function') {
        throw new Error(
          `[vesta] Server entry "${entrypoint}" must default-export an object with a fetch(request) method. Got: ${typeof mod.default}`,
        );
      }

      const response = await mod.default.fetch(request);

      return sendNodeResponse(res, response);
    } catch (err) {
      next(err);
    }
  };
}
