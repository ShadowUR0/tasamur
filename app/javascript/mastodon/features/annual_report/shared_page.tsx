import type { FC } from 'react';

import { FormattedMessage } from 'react-intl';

import { DisplayName } from '@/mastodon/components/display_name';
import { IconLogo } from '@/mastodon/components/logo';
import { useAppSelector } from '@/mastodon/store';

import { AnnualReport, accountSelector } from './index';
import classes from './shared_page.module.scss';

export const WrapstodonSharedPage: FC = () => {
  const account = useAppSelector(accountSelector);
  return (
    <main className={classes.wrapper}>
      <AnnualReport />
      <footer className={classes.footer}>
        <div className={classes.footerSection}>
          <IconLogo className={classes.logo} />
          <FormattedMessage
            id='annual_report.shared_page.footer'
            defaultMessage='Generated with {heart} by the Mastodon team'
            values={{ heart: '🐘' }}
            tagName='p'
          />
          <ul className={classes.linkList}>
            <li>
              <a href='https://joinmastodon.org'>
                <FormattedMessage
                  id='footer.about_mastodon'
                  defaultMessage='About Mastodon'
                />
              </a>
            </li>
            <li>
              <a href='https://joinmastodon.org/sponsors'>
                <FormattedMessage
                  id='annual_report.shared_page.donate'
                  defaultMessage='Donate'
                />
              </a>
            </li>
          </ul>
        </div>

        <div className={classes.footerSection}>
          <FormattedMessage
            id='tasamur.annual_report.shared_page.footer_info'
            defaultMessage='{username} uses Tasamur.'
            values={{
              username: <DisplayName variant='simple' account={account} />,
            }}
            tagName='p'
          />
          <a href='/about'>
            <FormattedMessage
              id='tasamur.footer.about'
              defaultMessage='About Tasamur'
            />
          </a>
        </div>
      </footer>
    </main>
  );
};
