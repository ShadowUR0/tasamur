# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Status, '.local_network' do
  let!(:local_status) { Fabricate(:status) }
  let!(:local_reply) { Fabricate(:status, in_reply_to_id: local_status.id) }
  let!(:local_reblog) { Fabricate(:status, reblog: local_status) }
  let!(:remote_status) { Fabricate(:status, account: Fabricate(:account, domain: 'remote.example')) }
  let!(:reply_to_remote) { Fabricate(:status, in_reply_to_id: remote_status.id) }
  let!(:reblog_of_remote) { Fabricate(:status, reblog: remote_status) }

  it 'keeps local conversations and reposts while excluding remote content' do
    status_ids = described_class.local_network.pluck(:id)

    expect(status_ids).to include(local_status.id, local_reply.id, local_reblog.id)
    expect(status_ids).to_not include(remote_status.id, reply_to_remote.id, reblog_of_remote.id)
  end
end
