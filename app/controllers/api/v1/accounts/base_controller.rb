# frozen_string_literal: true

class Api::V1::Accounts::BaseController < Api::BaseController
  private

  def set_account
    scope = single_network_mode? ? Account.local : Account.all
    @account = scope.without_requested_deletion.find(params[:account_id])
  end
end
