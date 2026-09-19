# frozen_string_literal: true

module BrandingHelper
  def logo_as_symbol(version = :icon)
    case version
    when :icon
      _logo_as_symbol_icon
    when :wordmark
      _logo_as_symbol_wordmark
    end
  end

  def _logo_as_symbol_wordmark
    render_logo(:wordmark)
  end

  def _logo_as_symbol_icon
    render_logo
  end

  def render_logo(version = :icon)
    image_tag(frontend_asset_path('images/logo.svg'), alt: 'Tasamur', class: "logo logo--#{version}")
  end
end
