# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DomainControlHelper do
  subject(:helper) do
    Class.new do
      include DomainControlHelper
    end.new
  end

  context 'when Tasamur single-network mode is enabled' do
    before do
      allow(Rails.configuration.x.mastodon).to receive(:single_network_mode).and_return(true)
    end

    it 'allows the local domain' do
      expect(helper.domain_not_allowed?(Rails.configuration.x.local_domain)).to be false
    end

    it 'rejects external domains and URLs' do
      expect(helper.domain_not_allowed?('remote.example')).to be true
      expect(helper.domain_not_allowed?('https://remote.example/inbox')).to be true
    end
  end
end
