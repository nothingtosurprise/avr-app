import { ServiceUnavailableException } from '@nestjs/common';
import { buildProvisioningSyncException } from './provisioning-sync';

describe('buildProvisioningSyncException', () => {
  it('returns operator-visible retryable metadata', () => {
    const error = buildProvisioningSyncException(
      'trunk',
      'update',
      new Error('reload failed'),
    );

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect(error.getStatus()).toBe(503);
    expect(error.getResponse()).toEqual({
      code: 'ASTERISK_SYNC_FAILED',
      resource: 'trunk',
      action: 'update',
      retryable: true,
      reason: 'Asterisk sync failed during trunk update',
      detail: 'reload failed',
    });
  });
});
