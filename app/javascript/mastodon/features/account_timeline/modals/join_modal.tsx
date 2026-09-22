import { useCallback, useMemo } from 'react';
import type { FC } from 'react';

import { defineMessage, FormattedMessage, useIntl } from 'react-intl';

import AnniversaryImage from '@/images/anniversary.svg?react';
import { focusCompose, resetCompose } from '@/mastodon/actions/compose';
import { closeModal } from '@/mastodon/actions/modal';
import { Button } from '@/mastodon/components/button';
import { DisplayNameSimple } from '@/mastodon/components/display_name/simple';
import { FormattedDateWrapper } from '@/mastodon/components/formatted_date';
import { IconButton } from '@/mastodon/components/icon_button';
import { ModalShell, ModalShellBody } from '@/mastodon/components/modal_shell';
import { useAccount } from '@/mastodon/hooks/useAccount';
import { useCurrentAccountId } from '@/mastodon/hooks/useAccountId';
import { useAppDispatch } from '@/mastodon/store';
import CloseIcon from '@/material-icons/400-24px/close.svg?react';

import classes from './styles.module.scss';

const closeMessage = defineMessage({
  id: 'lightbox.close',
  defaultMessage: 'Close',
});

export const AccountJoinModal: FC<{
  accountId: string;
  onClose: () => void;
}> = ({ accountId, onClose }) => {
  const intl = useIntl();
  const account = useAccount(accountId);
  const currentId = useCurrentAccountId();
  const isMe = accountId === currentId;

  const createdAtStr = account?.created_at;
  const anniversary = useMemo(() => {
    if (!createdAtStr) {
      return null;
    }
    const now = new Date();
    const createdAt = new Date(createdAtStr);
    if (
      now.getMonth() === createdAt.getMonth() &&
      now.getDate() === createdAt.getDate()
    ) {
      return now.getFullYear() - createdAt.getFullYear();
    }
    return null;
  }, [createdAtStr]);

  const dispatch = useAppDispatch();
  const handle = account?.acct;
  const handleShare = useCallback(() => {
    if (anniversary === null) {
      return;
    }

    let shareText = '#TasamurAnniversary';
    if (anniversary === 0) {
      shareText = isMe ? '#firstday' : '#welcome';
    }

    if (!isMe && handle) {
      shareText = `@${handle} ${shareText}`;
    }

    dispatch(resetCompose());
    dispatch(focusCompose(`\n\n${shareText}`, true));
    dispatch(closeModal({ modalType: 'ACCOUNT_JOIN_DATE', ignoreFocus: true }));
  }, [anniversary, handle, dispatch, isMe]);

  return (
    <ModalShell as='div' className={classes.joinShell}>
      <ModalShellBody className={classes.joinWrapper}>
        <AccountAnniversaryImage anniversary={anniversary} />

        <div>
          <AccountJoinMessage
            name={<DisplayNameSimple account={account} />}
            isMe={isMe}
            anniversary={anniversary}
          />
          <h1>
            <FormattedDateWrapper
              value={account?.created_at}
              month='short'
              day='numeric'
              year='numeric'
            />
          </h1>
        </div>

        <AccountAnniversaryShare
          anniversary={anniversary}
          onShare={handleShare}
          isMe={isMe}
        />

        <IconButton
          iconComponent={CloseIcon}
          icon='times'
          onClick={onClose}
          title={intl.formatMessage(closeMessage)}
          className={classes.joinClose}
        />
      </ModalShellBody>
    </ModalShell>
  );
};

const AccountJoinMessage: FC<{
  name: React.JSX.Element;
  isMe: boolean;
  anniversary: number | null;
}> = ({ name, isMe, anniversary }) => {
  if (anniversary === 0) {
    if (isMe) {
      return (
        <FormattedMessage
          id='tasamur.account.join_modal.me_today'
          defaultMessage='It’s your first day on Tasamur!'
          tagName='p'
        />
      );
    }
    return (
      <FormattedMessage
        id='tasamur.account.join_modal.other_today'
        defaultMessage='It’s {name}’s first day on Tasamur!'
        tagName='p'
        values={{
          name,
        }}
      />
    );
  }

  if (isMe) {
    if (anniversary !== null && anniversary > 0) {
      return (
        <FormattedMessage
          id='tasamur.account.join_modal.me_anniversary'
          defaultMessage='Happy Tasamur anniversary! You joined on'
          tagName='p'
        />
      );
    }
    return (
      <FormattedMessage
        id='tasamur.account.join_modal.me'
        defaultMessage='You joined Tasamur on'
        tagName='p'
      />
    );
  }

  return (
    <FormattedMessage
      id='tasamur.account.join_modal.other'
      defaultMessage='{name} joined Tasamur on'
      tagName='p'
      values={{
        name,
      }}
    />
  );
};

const AccountAnniversaryImage: FC<{ anniversary: number | null }> = ({
  anniversary,
}) => {
  if (anniversary === null) {
    return null;
  }

  return (
    <div className={classes.joinBanner}>
      <AnniversaryImage role='presentation' />
      <h2>{anniversary || 1}</h2>
      {anniversary === 0 && (
        <FormattedMessage
          id='account.join_modal.day'
          defaultMessage='Day'
          tagName='h3'
        />
      )}
      {anniversary > 0 && (
        <FormattedMessage
          id='account.join_modal.years'
          defaultMessage='{number, plural, one {year} other {years}}'
          values={{ number: anniversary }}
          tagName='h3'
        />
      )}
    </div>
  );
};

const AccountAnniversaryShare: FC<{
  anniversary: number | null;
  onShare: () => void;
  isMe: boolean;
}> = ({ anniversary, onShare, isMe }) => {
  if (anniversary === null) {
    return null;
  }

  return (
    <Button onClick={onShare}>
      {anniversary === 0 && isMe && (
        <FormattedMessage
          id='account.join_modal.share.intro'
          defaultMessage='Share an intro post'
        />
      )}
      {anniversary === 0 && !isMe && (
        <FormattedMessage
          id='account.join_modal.share.welcome'
          defaultMessage='Share a welcome post'
        />
      )}
      {anniversary > 0 && (
        <FormattedMessage
          id='account.join_modal.share.celebrate'
          defaultMessage='Share a celebratory post'
        />
      )}
    </Button>
  );
};
