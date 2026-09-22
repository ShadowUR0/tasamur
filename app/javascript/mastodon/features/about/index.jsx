import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import { Helmet } from '@unhead/react/helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { injectIntl } from '@/mastodon/components/intl';
import { fetchServer, fetchExtendedDescription } from 'mastodon/actions/server';
import { Account } from 'mastodon/components/account';
import Column from 'mastodon/components/column';
import { NavigationFocusTarget } from 'mastodon/components/navigation_focus_target';
import { ServerHeroImage } from 'mastodon/components/server_hero_image';
import { Skeleton } from 'mastodon/components/skeleton';
import { LinkFooter} from 'mastodon/features/ui/components/link_footer';

import { Section } from './components/section';
import { RulesSection } from './components/rules';
import { getColumnSkipLinkId } from '../ui/components/skip_links';

const messages = defineMessages({
  title: { id: 'column.about', defaultMessage: 'About' },
});

const mapStateToProps = state => ({
  server: state.server.server,
  extendedDescription: state.server.extendedDescription,
});

class About extends PureComponent {

  static propTypes = {
    server: ImmutablePropTypes.map,
    extendedDescription: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchServer());
    dispatch(fetchExtendedDescription());
  }

  render () {
    const { multiColumn, intl, server, extendedDescription } = this.props;
    const isLoading = server.isLoading;

    return (
      <Column bindToDocument={!multiColumn} label={intl.formatMessage(messages.title)}>
        <div className='scrollable about' id={getColumnSkipLinkId(1)}>
          <div className='about__header'>
            <ServerHeroImage
              withAltBadge
              alt={server.item?.thumbnail.description ?? ''}
              blurhash={server.item?.thumbnail.blurhash}
              src={server.item?.thumbnail.url}
              srcSet={Object.keys(server.item?.thumbnail.versions ?? {}).map((key) => `${server.item?.thumbnail.versions && server.item.thumbnail.versions[key]} ${key.replace('@', '')}`).join(', ')}
              className='about__header__hero'
            />
            <NavigationFocusTarget as='h1'>
              {isLoading ? <Skeleton width='10ch' /> : <FormattedMessage id='tasamur.about.name' defaultMessage='Tasamur' />}
            </NavigationFocusTarget>
            <p><FormattedMessage id='tasamur.about.powered_by' defaultMessage='Tasamur is powered by {mastodon}' values={{ mastodon: <a href='https://joinmastodon.org' className='about__mail' target='_blank' rel='noopener'>Mastodon</a> }} /></p>
          </div>

          <div className='about__meta'>
            <div className='about__meta__column'>
              <h4><FormattedMessage id='server_banner.administered_by' defaultMessage='Administered by:' /></h4>

              <Account id={server.item?.contact?.account?.id} size={36} minimal />
            </div>

            <hr className='about__meta__divider' />

            <div className='about__meta__column'>
              <h4><FormattedMessage id='about.contact' defaultMessage='Contact:' /></h4>

              {isLoading ? <Skeleton width='10ch' /> : <a className='about__mail' href={`mailto:${server.item?.contact?.email}`}>{server.item?.contact?.email}</a>}
            </div>
          </div>

          <Section open title={intl.formatMessage(messages.title)}>
            {extendedDescription.isLoading ? (
              <>
                <Skeleton width='100%' />
                <br />
                <Skeleton width='100%' />
                <br />
                <Skeleton width='100%' />
                <br />
                <Skeleton width='70%' />
              </>
            ) : (extendedDescription.item?.content?.length > 0 ? (
              <div
                className='prose'
                dangerouslySetInnerHTML={{ __html: extendedDescription.item?.content }}
              />
            ) : (
              <p><FormattedMessage id='tasamur.about.not_available' defaultMessage='This information is not currently available.' /></p>
            ))}
          </Section>

          <RulesSection />

          <LinkFooter context='about' />

          <div className='about__footer'>
            <p><FormattedMessage id='about.disclaimer' defaultMessage='Mastodon is free, open-source software, and a trademark of Mastodon GmbH.' /></p>
          </div>
        </div>

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='all' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(About));
