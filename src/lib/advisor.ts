import { z } from 'zod';

export const MAX_ADVISOR_TURNS = 12;
export const MAX_ADVISOR_CONTEXT_CHARS = 6000;
export const advisorMessageSchema = z.discriminatedUnion('role', [
  z.object({ role: z.literal('user'), content: z.string().trim().min(1).max(1200) }),
  z.object({ role: z.literal('assistant'), content: z.string().trim().min(1).max(4000) }),
]);
export type AdvisorMessage = z.infer<typeof advisorMessageSchema>;

export const advisorRequestSchema = z.object({
  messages: z
    .array(advisorMessageSchema)
    .min(1)
    .max(MAX_ADVISOR_TURNS * 2 - 1),
});

export function validateConversation(messages: AdvisorMessage[]): boolean {
  if (messages[messages.length - 1]?.role !== 'user') return false;
  if (messages.filter((message) => message.role === 'user').length > MAX_ADVISOR_TURNS)
    return false;
  if (
    messages.reduce((size, message) => size + message.content.length, 0) > MAX_ADVISOR_CONTEXT_CHARS
  )
    return false;
  return messages.every((message, index) => message.role === (index % 2 ? 'assistant' : 'user'));
}

export async function sendAdvisorMessage(messages: AdvisorMessage[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal: AbortSignal.timeout(18000),
  });
  const data = (await response.json().catch(() => null)) as {
    reply?: string;
    error?: string;
  } | null;
  if (!response.ok || !data?.reply)
    throw new Error(data?.error || 'The advisor could not answer right now. Please retry.');
  return data.reply;
}
