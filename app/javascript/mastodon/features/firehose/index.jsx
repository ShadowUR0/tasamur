import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';

import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { Helmet } from '@unhead/react/helmet';

import { useIdentity } from '@/mastodon/identity_context';
import PublicIcon from '@/material-icons/400-24px/public.svg?react';
import { addColumn } from 'mastodon/actions/columns';
import { changeSetting } from 'mastodon/actions/settings';
import { connectCommunityStream } from 'mastodon/actions/streaming';
import { expandCommunityTimeline } from 'mastodon/actions/timelines';
import { DismissableBanner } from 'mastodon/components/dismissable_banner';
import { localLiveFeedAccess } from 'mastodon/initial_state';
import { canViewFeed } from 'mastodon/permissions';
import { useAppDispatch, useAppSelector } from 'mastodon/store';

import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import SettingToggle from '../notifications/components/setting_toggle';
import StatusListContainer from '../ui/containers/status_list_container';

const messages = defineMessages({
  title: {
    id: 'tasamur.column.live_feed',
    defaultMessage: 'Live feed',
  },
});

const ColumnSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) =>
    state.getIn(['settings', 'firehose']),
  );
  const onChange = useCallback(
    (key, checked) => dispatch(changeSetting(['firehose', ...key], checked)),
    [dispatch],
  );

  return (
    <div className='column-settings'>
      <section>
        <div className='column-settings__row'>
          <SettingToggle
            settings={settings}
            settingPath={['onlyMedia']}
            onChange={onChange}
            label={
              <FormattedMessage
                id='community.column_settings.media_only'
                defaultMessage='Media only'
              />
            }
          />
        </div>
      </section>
    </div>
  );
};

const Firehose = ({ multiColumn }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const { signedIn, permissions } = useIdentity();
  const columnRef = useRef(null);

  const onlyMedia = useAppSelector((state) =>
    state.getIn(['settings', 'firehose', 'onlyMedia'], false),
  );
  const timelineId = `community${onlyMedia ? ':media' : ''}`;
  const hasUnread = useAppSelector(
    (state) => state.getIn(['timelines', timelineId, 'unread'], 0) > 0,
  );

  const handlePin = useCallback(() => {
    dispatch(addColumn('COMMUNITY', { other: { onlyMedia } }));
  }, [dispatch, onlyMedia]);

  const handleLoadMore = useCallback(
    (maxId) => {
      dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
    },
    [dispatch, onlyMedia],
  );

  const handleHeaderClick = useCallback(
    () => columnRef.current?.scrollTop(),
    [],
  );

  useEffect(() => {
    dispatch(expandCommunityTimeline({ onlyMedia }));

    if (signedIn) {
      return dispatch(connectCommunityStream({ onlyMedia }));
    }

    return undefined;
  }, [dispatch, signedIn, onlyMedia]);

  const canViewSelectedFeed = canViewFeed(
    signedIn,
    permissions,
    localLiveFeedAccess,
  );

  const emptyMessage = canViewSelectedFeed ? (
    <FormattedMessage
      id='tasamur.empty_column.live_feed'
      defaultMessage='The live feed is empty. Write something publicly to get the conversation started!'
    />
  ) : (
    <FormattedMessage
      id='tasamur.empty_column.disabled_feed'
      defaultMessage='This feed is not currently available.'
    />
  );

  return (
    <Column
      bindToDocument={!multiColumn}
      ref={columnRef}
      label={intl.formatMessage(messages.title)}
    >
      <ColumnHeader
        icon='globe'
        iconComponent={PublicIcon}
        active={hasUnread}
        title={intl.formatMessage(messages.title)}
        onPin={handlePin}
        onClick={handleHeaderClick}
        multiColumn={multiColumn}
      >
        <ColumnSettings />
      </ColumnHeader>

      <StatusListContainer
        prepend={
          <DismissableBanner id='community_timeline'>
            <FormattedMessage
              id='tasamur.dismissable_banner.live_feed'
              defaultMessage='These are the most recent public posts shared on Tasamur.'
            />
          </DismissableBanner>
        }
        timelineId={timelineId}
        onLoadMore={handleLoadMore}
        trackScroll
        scrollKey='firehose'
        emptyMessage={emptyMessage}
        bindToDocument={!multiColumn}
      />

      <Helmet>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name='robots' content='noindex' />
      </Helmet>
    </Column>
  );
};

Firehose.propTypes = {
  multiColumn: PropTypes.bool,
};

export default Firehose;
