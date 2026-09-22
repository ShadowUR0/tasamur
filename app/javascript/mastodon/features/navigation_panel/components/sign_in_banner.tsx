import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { openModal } from 'mastodon/actions/modal';
import { registrationsOpen, sso_redirect } from 'mastodon/initial_state';
import { useAppDispatch, useAppSelector } from 'mastodon/store';

export const SignInBanner: React.FC = () => {
  const dispatch = useAppDispatch();

  const openClosedRegistrationsModal = useCallback(
    () =>
      dispatch(
        openModal({ modalType: 'CLOSED_REGISTRATIONS', modalProps: {} }),
      ),
    [dispatch],
  );

  let signupButton: React.ReactNode;

  const signupUrl = useAppSelector(
    (state) => state.server.server.item?.registrations.url ?? '/auth/sign_up',
  );

  if (sso_redirect) {
    return (
      <div className='sign-in-banner'>
        <p>
          <strong>
            <FormattedMessage
              id='tasamur.sign_in_banner.introduction'
              defaultMessage='Tasamur is a place to keep up with what’s happening.'
            />
          </strong>
        </p>
        <p>
          <FormattedMessage
            id='tasamur.sign_in_banner.description'
            defaultMessage='Follow people, share updates, and see posts in chronological order.'
          />
        </p>
        <a
          href={sso_redirect}
          data-method='post'
          className='button button--block button-secondary'
        >
          <FormattedMessage
            id='sign_in_banner.sso_redirect'
            defaultMessage='Login or Register'
          />
        </a>
      </div>
    );
  }

  if (registrationsOpen) {
    signupButton = (
      <a href={signupUrl} className='button button--block'>
        <FormattedMessage
          id='sign_in_banner.create_account'
          defaultMessage='Create account'
        />
      </a>
    );
  } else {
    signupButton = (
      <button
        className='button button--block'
        onClick={openClosedRegistrationsModal}
        type='button'
      >
        <FormattedMessage
          id='sign_in_banner.create_account'
          defaultMessage='Create account'
        />
      </button>
    );
  }

  return (
    <div className='sign-in-banner'>
      <p>
        <strong>
          <FormattedMessage
            id='tasamur.sign_in_banner.introduction'
            defaultMessage='Tasamur is a place to keep up with what’s happening.'
          />
        </strong>
      </p>
      <p>
        <FormattedMessage
          id='tasamur.sign_in_banner.description'
          defaultMessage='Follow people, share updates, and see posts in chronological order.'
        />
      </p>
      {signupButton}
      <a href='/auth/sign_in' className='button button--block button-secondary'>
        <FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Login' />
      </a>
    </div>
  );
};
