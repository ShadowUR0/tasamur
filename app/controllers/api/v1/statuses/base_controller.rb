# frozen_string_literal: true

class Api::V1::Statuses::BaseController < Api::BaseController
  include Authorization

  before_action :set_status

  private

  def set_status
    scope = single_network_mode? ? Status.local_network : Status.all
    @status = scope.find(params[:status_id])
    authorize @status, :show?
  rescue ActiveRecord::RecordNotFound, Mastodon::NotPermittedError
    not_found
  end
end
