import { FormattedMessage } from 'react-intl';

import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { fetchServer } from 'mastodon/actions/server';
import { domain } from 'mastodon/initial_state';
import { NavigationFocusTarget } from '@/mastodon/components/navigation_focus_target';

const mapStateToProps = state => ({
  message: state.getIn(['server', 'server', 'item', 'registrations', 'message']),
});

class ClosedRegistrationsModal extends ImmutablePureComponent {

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchServer());
  }

  render () {
    let closedRegistrationsMessage;

    if (this.props.message) {
      closedRegistrationsMessage = (
        <p
          className='prose'
          dangerouslySetInnerHTML={{ __html: this.props.message }}
        />
      );
    } else {
      closedRegistrationsMessage = (
        <p className='prose'>
          <FormattedMessage
            id='closed_registrations_modal.description'
            defaultMessage='Creating an account on {domain} is currently not possible, but please keep in mind that you do not need an account specifically on {domain} to use Mastodon.'
            values={{ domain: <strong>{domain}</strong> }}
          />
        </p>
      );
    }

    return (
      <div className='modal-root__modal interaction-modal'>
        <div className='interaction-modal__lead'>
          <NavigationFocusTarget as='h1'>
            <FormattedMessage id='closed_registrations_modal.title' defaultMessage='Signing up on Mastodon' />
          </NavigationFocusTarget>
        </div>

        <div className='interaction-modal__choices'>
          <div className='interaction-modal__choices__choice'>
            {closedRegistrationsMessage}
          </div>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(ClosedRegistrationsModal);
