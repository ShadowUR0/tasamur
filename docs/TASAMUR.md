# Tasamur foundation

Baseline: official Mastodon v4.7.2 (`3987b9fd624010eeeaeb7cad96606b05aa813f6a`).
Preserve the supplied root PDF and ZIP as references.

- Default name: `config/settings.yml`; existing administrator settings still win.
- Palette: `app/javascript/styles/mastodon/tokens/theme/_tasamur.scss`.
  Browser/PWA surface colors also live in `app/lib/themes.rb`.
- English Web/push copy: `app/javascript/mastodon/locales/tasamur/`.
  Rails copy: `config/locales/tasamur.en.yml`, loaded after upstream English files.
  Keep message IDs and `reblog` API semantics unchanged.
- Source links default to this fork through `config/mastodon.yml`.

Artwork uses only the ZIP's `tasamur-symbol-strict-clean-v2.svg`:

- `app/javascript/images/logo.svg` and `logo-symbol-icon.svg`: original symbol;
  the latter also supplies Safari's mask icon.
- `app/javascript/images/app-icon.svg`: symbol centered on an opaque square,
  inside the maskable safe zone. `app/javascript/icons/` contains PNG favicon
  (16/32/48), Apple (57–1024), and Android/PWA (36–512) exports.
- `public/badge.png`: white silhouette for push notifications.
- `app/javascript/images/mailer-new/common/logo-{header,footer}.png` and
  `app/javascript/images/mailer/logo.png`: raster symbol exports for email.

Still needed: standalone approved English/Arabic SVG wordmarks. Until supplied,
the UI uses the symbol with accessible Tasamur labels. Future replacements belong
at `app/javascript/images/logo-symbol-wordmark.svg` and the corresponding React
logo component/Rails helper; legacy `app/javascript/images/mailer/wordmark.png`
and `lib/assets/wordmark.{dark,light}.png` need review before regenerating them.
Diagnostic overlays/difference images are not production artwork.

Deferred: broader localization, remote sign-in/interaction flows, server-qualified
handles, migration, and federation architecture. Public pages, moderation, REST,
and ActivityPub remain intact. Native app links remain compatibility references;
the PWA does not advertise Mastodon apps as Tasamur apps.
