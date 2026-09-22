# frozen_string_literal: true

class AuthorizeInteractionsController < ApplicationController
  include Authorization

  before_action :authenticate_user!
  before_action :set_resource

  def show
    case @resource
    when Account
      redirect_to web_url("@#{@resource.pretty_acct}")
    when Status
      redirect_to web_url("@#{@resource.account.pretty_acct}/#{@resource.id}")
    when Collection
      redirect_to web_url("collections/#{@resource.id}")
    else
      not_found
    end
  end

  private

  def set_resource
    @resource = located_resource
    authorize(@resource, :show?) if @resource.is_a?(Status)
  rescue ActiveRecord::RecordNotFound, Mastodon::NotPermittedError
    not_found
  end

  def located_resource
    if uri_param_is_url?
      ResolveURLService.new.call(uri_param) if local_uri?
    else
      local_account
    end
  end

  def local_account
    username, domain = uri_param.strip.gsub(/\A@/, '').split('@', 2)
    Account.find_local(username) if domain.nil? || TagManager.instance.local_domain?(domain)
  end

  def local_uri?
    TagManager.instance.local_url?(uri_param)
  end

  def uri_param_is_url?
    parsed_uri.path && %w(http https).include?(parsed_uri.scheme)
  end

  def parsed_uri
    Addressable::URI.parse(uri_param).normalize
  end

  def uri_param
    params[:uri] || params.fetch(:acct, '').delete_prefix('acct:')
  end
end
