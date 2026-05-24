import { ProviderType } from '../providers/provider.entity';

export class ProviderReadinessTimeoutError extends Error {
  constructor(
    public readonly providerName: string,
    public readonly providerType: ProviderType,
    public readonly timeoutMs: number,
  ) {
    super(
      `Provider ${providerName} (${providerType}) readiness timeout after ${timeoutMs}ms`,
    );
    this.name = 'ProviderReadinessTimeoutError';
  }
}
