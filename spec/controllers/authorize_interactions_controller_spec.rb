# frozen_string_literal: true

require 'rails_helper'

RSpec.describe AuthorizeInteractionsController do
  render_views

  describe 'GET #show' do
    describe 'when signed out' do
      it 'redirects to sign in page' do
        get :show

        expect(response).to redirect_to(new_user_session_path)
      end
    end

    describe 'when signed in' do
      let(:user) { Fabricate(:user) }

      before do
        sign_in(user)
      end

      it 'renders error without acct param' do
        get :show

        expect(response).to have_http_status(404)
      end

      it 'does not resolve an account on another domain' do
        allow(ResolveAccountService).to receive(:new)

        get :show, params: { acct: 'acct:missing@hostname' }

        expect(response).to have_http_status(404)
        expect(ResolveAccountService).to_not have_received(:new)
      end

      it 'does not resolve an external URL' do
        allow(ResolveURLService).to receive(:new)

        get :show, params: { acct: 'https://example.com/@alice' }

        expect(response).to have_http_status(404)
        expect(ResolveURLService).to_not have_received(:new)
      end

      it 'sets a resource from a local URL' do
        account = Fabricate(:account)
        local_url = account_url(account, host: Rails.configuration.x.web_domain)
        service = instance_double(ResolveURLService)
        allow(ResolveURLService).to receive(:new).and_return(service)
        allow(service).to receive(:call).with(local_url).and_return(account)

        get :show, params: { acct: local_url }

        expect(response)
          .to have_http_status(302)
          .and redirect_to(web_url("@#{account.pretty_acct}"))
      end

      it 'sets a resource from a local account handle' do
        account = Fabricate(:account)

        get :show, params: { acct: "acct:#{account.username}@#{Rails.configuration.x.local_domain}" }

        expect(response)
          .to have_http_status(302)
          .and redirect_to(web_url("@#{account.pretty_acct}"))
      end
    end
  end
end
