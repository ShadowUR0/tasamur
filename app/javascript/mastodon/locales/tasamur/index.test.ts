// @vitest-environment node
import { IntlMessageFormat } from 'intl-messageformat';

import upstream from '../en.json';

import english from './en.json';
import { applyTasamurMessages } from './index';

describe('Tasamur presentation messages', () => {
  it.each(['en', 'en-GB'])(
    'overrides English copy for %s without mutating upstream',
    (locale) => {
      const messages = applyTasamurMessages(locale, upstream);

      expect(messages['status.reblog']).toBe('Repost');
      expect(messages['notification.reblog']).toBe('{name} reposted your post');
      expect(messages['about.disclaimer']).toBe(upstream['about.disclaimer']);
      expect(upstream['status.reblog']).toBe('Boost');
    },
  );

  it('preserves other languages for a dedicated localization pass', () => {
    const messages = { 'status.reblog': 'Partager' };
    expect(applyTasamurMessages('fr', messages)).toBe(messages);
  });

  it('only overrides existing message IDs', () => {
    for (const key of Object.keys(english)) {
      expect(Object.hasOwn(upstream, key)).toBe(true);
    }
  });

  it('preserves ICU arguments and rich-text tags in every override', () => {
    function argumentsIn(message: string) {
      const names = new Set<string>();
      function visit(elements: ReturnType<IntlMessageFormat['getAst']>) {
        for (const element of elements) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- ICU literal (0) and pound (7) nodes have no arguments.
          if (element.type === 0 || element.type === 7) continue;
          names.add(element.value);
          if ('options' in element) {
            for (const option of Object.values(element.options))
              visit(option.value);
          }
          if ('children' in element) visit(element.children);
        }
      }
      visit(new IntlMessageFormat(message, 'en').getAst());
      return [...names].sort();
    }

    for (const [key, message] of Object.entries(english)) {
      expect(argumentsIn(message)).toEqual(
        argumentsIn(upstream[key as keyof typeof upstream]),
      );
    }
  });

  it('formats repost counts and notification names with existing API values', () => {
    const count = new IntlMessageFormat(english['status.reblogs_count'], 'en');
    expect(count.format({ count: 1, counter: '1' })).toBe('1 repost');
    expect(count.format({ count: 4, counter: '4' })).toBe('4 reposts');

    const notification = new IntlMessageFormat(
      english['notification.reblog'],
      'en',
    );
    expect(notification.format({ name: 'Sam' })).toBe('Sam reposted your post');
  });

  it('keeps registration availability honest', () => {
    const message = new IntlMessageFormat(
      english['closed_registrations_modal.description'],
      'en',
    );
    expect(message.format({ domain: 'example.org' })).toContain(
      'example.org is currently not possible',
    );
  });
});
