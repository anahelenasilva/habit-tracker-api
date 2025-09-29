import { Injectable } from '@kernel/decorators/injectable';

type CompensationFn = () => Promise<void>;

@Injectable()
export class Saga {
  private compensations: CompensationFn[] = [];

  addCompensation(fn: CompensationFn) {
    //add to the beginning of the array to ensure LIFO order
    this.compensations.unshift(fn);
  }

  async run<TResult>(fn: () => Promise<TResult>) {
    try {
      return await fn();
    } catch (error) {
      await this.compensate();

      throw error;
    }
  }

  async compensate() {
    for await (const compensation of this.compensations) {
      try {
        await compensation();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Compensation failed, manual intervention might be required.', { error });
      }
    }
  }
}
