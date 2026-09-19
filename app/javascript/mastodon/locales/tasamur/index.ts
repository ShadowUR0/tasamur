import english from './en.json';

/** Share presentation overrides between the Web UI and push notifications. */
export function applyTasamurMessages(
  locale: string,
  messages: Record<string, string>,
): Record<string, string> {
  if (locale !== 'en' && !locale.startsWith('en-')) return messages;

  return { ...messages, ...english };
}
