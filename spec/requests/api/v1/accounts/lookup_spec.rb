# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Accounts Lookup API' do
  include_context 'with API authentication', oauth_scopes: 'read:accounts'

  let(:account) { Fabricate(:account) }

  describe 'GET /api/v1/accounts/lookup' do
    it 'returns http success' do
      get '/api/v1/accounts/lookup', params: { account_id: account.id, acct: account.acct }, headers: headers

      expect(response).to have_http_status(200)
      expect(response.content_type)
        .to start_with('application/json')
    end

    context 'when Tasamur single-network mode is enabled' do
      let(:remote_account) { Fabricate(:account, domain: 'remote.example') }

      before do
        allow(Rails.configuration.x.mastodon).to receive(:single_network_mode).and_return(true)
      end

      it 'does not return a known remote account' do
        get '/api/v1/accounts/lookup', params: { acct: remote_account.acct }, headers: headers

        expect(response).to have_http_status(404)
      end

      it 'continues to return a local account' do
        get '/api/v1/accounts/lookup', params: { acct: account.acct }, headers: headers

        expect(response).to have_http_status(200)
        expect(response.parsed_body[:id]).to eq(account.id.to_s)
      end
    end
  end
end
