# Tasamur

Tasamur (تسامر) is a Mastodon fork. Preserve upstream AGPL licensing,
attribution, security controls, accessibility, and client/API compatibility.

- Use existing Mastodon settings, tokens, and extension points first.
- Keep changes small and easy to carry across stable upstream updates.
- Rebrand user-facing presentation deliberately; never blindly replace Mastodon
  in technical identifiers, protocols, dependencies, or legal notices.
- Keep feeds, profiles, navigation, typography, and layout close to upstream.
- Keep Tasamur copy overrides and palette centralized; avoid translation churn.
- Use supplied finished artwork only. Do not invent logos or wordmarks.
- Avoid unnecessary dependencies, schema changes, refactors, and new features.
- Use the existing package managers and lockfiles. Run checks targeted to changes
  and one production asset build; do not default to full test suites.
- Infrastructure, deployment, billing, and production changes require separate
  explicit authorization.
