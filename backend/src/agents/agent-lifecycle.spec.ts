import { ConflictException } from '@nestjs/common';
import { AgentStatus } from './agent.entity';
import {
  AGENT_LIFECYCLE_TRANSITIONS,
  assertAgentLifecycleTransition,
  getAllowedAgentTransitions,
} from './agent-lifecycle';

describe('agent-lifecycle', () => {
  const allStatuses = Object.values(AgentStatus);

  describe('transition matrix', () => {
    it.each(
      Object.entries(AGENT_LIFECYCLE_TRANSITIONS).flatMap(([from, targets]) =>
        targets.map((to) => [from as AgentStatus, to as AgentStatus]),
      ),
    )('allows %s -> %s', (from, to) => {
      expect(() => assertAgentLifecycleTransition(from, to)).not.toThrow();
    });

    it.each(
      allStatuses.flatMap((from) =>
        allStatuses
          .filter((to) => !getAllowedAgentTransitions(from).includes(to))
          .map((to) => [from, to]),
      ),
    )('rejects %s -> %s with typed conflict payload', (from, to) => {
      try {
        assertAgentLifecycleTransition(from, to);
        fail(`expected ${from} -> ${to} to be rejected`);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        const response = (error as ConflictException).getResponse() as Record<
          string,
          unknown
        >;
        expect(response).toEqual(
          expect.objectContaining({
            code: 'AGENT_INVALID_TRANSITION',
            reason: 'Agent lifecycle transition is not allowed',
            currentStatus: from,
            targetStatus: to,
            allowedTransitions: getAllowedAgentTransitions(from),
            retryable: false,
          }),
        );
      }
    });
  });
});
