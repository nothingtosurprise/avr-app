import { ConflictException } from '@nestjs/common';
import { AgentStatus } from './agent.entity';

export const AGENT_LIFECYCLE_TRANSITIONS: Record<AgentStatus, AgentStatus[]> = {
  [AgentStatus.STOPPED]: [AgentStatus.STARTING],
  [AgentStatus.STARTING]: [AgentStatus.RUNNING, AgentStatus.ERROR],
  [AgentStatus.RUNNING]: [AgentStatus.STOPPING],
  [AgentStatus.STOPPING]: [AgentStatus.STOPPED, AgentStatus.ERROR],
  [AgentStatus.ERROR]: [AgentStatus.STARTING, AgentStatus.STOPPING],
};

export function getAllowedAgentTransitions(from: AgentStatus): AgentStatus[] {
  return AGENT_LIFECYCLE_TRANSITIONS[from] ?? [];
}

export function assertAgentLifecycleTransition(
  from: AgentStatus,
  to: AgentStatus,
): void {
  const allowed = getAllowedAgentTransitions(from);
  if (allowed.includes(to)) {
    return;
  }

  throw new ConflictException({
    code: 'AGENT_INVALID_TRANSITION',
    reason: 'Agent lifecycle transition is not allowed',
    currentStatus: from,
    targetStatus: to,
    allowedTransitions: allowed,
    retryable: false,
  });
}
