# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Manifest' do
  describe 'GET /manifest' do
    before { get '/manifest' }

    it 'returns http success' do
      expect(response)
        .to have_http_status(200)
        .and have_cacheable_headers
        .and have_attributes(
          content_type: match('application/json')
        )
      expect(response.parsed_body)
        .to include(
          id: '/home',
          name: 'Tasamur',
          short_name: 'Tasamur',
          theme_color: Themes::THEME_COLORS[:dark],
          background_color: Themes::THEME_COLORS[:dark],
          prefer_related_applications: false,
          related_applications: []
        )
    end
  end
end
