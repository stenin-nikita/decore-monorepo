import type { ModuleRunner } from 'vite/module-runner';

export class Runner {
  #runner: ModuleRunner | undefined;

  constructor(runner?: ModuleRunner) {
    this.#runner = runner;
  }

  async import<T>(url: string): Promise<T> {
    if (this.#runner) {
      return this.#runner.import(url);
    }

    return import(url);
  }
}
