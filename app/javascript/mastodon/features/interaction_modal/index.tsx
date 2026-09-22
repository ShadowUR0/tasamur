import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { DisplayName } from '@/mastodon/components/display_name';
import { NavigationFocusTarget } from '@/mastodon/components/navigation_focus_target';
import { closeModal, openModal } from 'mastodon/actions/modal';
import { registrationsOpen, sso_redirect } from 'mastodon/initial_state';
import { useAppDispatch, useAppSelector } from 'mastodon/store';

const InteractionModal: React.FC<{
  accountId: string;
  url: string;
  intent: string;
}> = ({ accountId, intent }) => {
  const dispatch = useAppDispatch();
  const signupUrl = useAppSelector(
    (state) => state.server.server.item?.registrations.url ?? '/auth/sign_up',
  );
  const account = useAppSelector((state) => state.accounts.get(accountId));
  const name = <DisplayName account={account} variant='simple' />;

  const handleSignupClick = useCallback(() => {
    dispatch(
      closeModal({
        modalType: undefined,
        ignoreFocus: false,
      }),
    );

    dispatch(
      openModal({
        modalType: 'CLOSED_REGISTRATIONS',
        modalProps: {},
      }),
    );
  }, [dispatch]);

  let signupButton: React.ReactNode;

  if (registrationsOpen) {
    signupButton = (
      <a href={signupUrl} className='link-button'>
        <FormattedMessage
          id='sign_in_banner.create_account'
          defaultMessage='Create account'
        />
      </a>
    );
  } else {
    signupButton = (
      <button className='link-button' onClick={handleSignupClick} type='button'>
        <FormattedMessage
          id='sign_in_banner.create_account'
          defaultMessage='Create account'
        />
      </button>
    );
  }

  const signInButton = sso_redirect ? (
    <a href={sso_redirect} data-method='post' className='button button--block'>
      <FormattedMessage
        id='sign_in_banner.sso_redirect'
        defaultMessage='Login or Register'
      />
    </a>
  ) : (
    <a href='/auth/sign_in' className='button button--block'>
      <FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Login' />
    </a>
  );

  return (
    <div className='modal-root__modal interaction-modal'>
      <div className='interaction-modal__lead'>
        <NavigationFocusTarget as='h1'>
          <FormattedMessage
            id='tasamur.interaction_modal.title'
            defaultMessage='Sign in to Tasamur'
          />
        </NavigationFocusTarget>
        <p>
          {intent === 'follow' ? (
            <FormattedMessage
              id='tasamur.interaction_modal.action_follow'
              defaultMessage='Sign in to your Tasamur account to follow {name}.'
              values={{ name }}
            />
          ) : (
            <FormattedMessage
              id='tasamur.interaction_modal.action'
              defaultMessage="Sign in to your Tasamur account to interact with {name}'s post."
              values={{ name }}
            />
          )}
        </p>
      </div>

      <div className='interaction-modal__choices'>
        <div className='interaction-modal__choices__choice'>{signInButton}</div>
      </div>

      {!sso_redirect && (
        <p>
          <FormattedMessage
            id='interaction_modal.no_account_yet'
            defaultMessage="Don't have an account yet?"
          />{' '}
          {signupButton}
        </p>
      )}
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default InteractionModal;
