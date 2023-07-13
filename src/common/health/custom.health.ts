import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';

export interface Dog {
  name: string;
  type: string;
}

@Injectable()
export class CustomHealthIndicator extends HealthIndicator {
  private dogs: Dog[] = [
    { name: 'Fido', type: 'goodBoy' },
    { name: 'Rex', type: 'goodBoy' },
  ];

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const badBoys = this.dogs.filter((dog) => dog.type === 'badBoy');
    const isHealthy = badBoys.length === 0;
    const result = this.getStatus(key, isHealthy, { badBoy: badBoys.length });

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Custom check failed', result);
  }
}
