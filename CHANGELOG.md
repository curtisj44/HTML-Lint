# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
Guidelines:

1. Group changes to describe their impact on the project, as follows:
   - `Added` for new features.
   - `Changed` for changes in existing functionality.
   - `Deprecated` for once-stable features removed in upcoming releases.
   - `Fixed` for any bug fixes.
   - `Removed` for deprecated features removed in this release.
   - `Security` to invite users to upgrade in case of vulnerabilities.

2. Mark breaking items using: **Breaking** 💥
-->

## [Unreleased]

### Added

- This changelog
- Check for empty `srcset` attributes
- Check for missing `title` attribute on `iframe`
- Check for empty `src` attributes (on all elements, not only `img`)
- Check to ensure `aria-hidden` attributes equals "true", when present
- Check for legacy `allowfullscreen` attributes (and the vendor variations `mozallowfullscreen` and `webkitallowfullscreen`)
- Check for legacy `allowpaymentrequest` attributes

## [2.4.2] - 2019-12-05

Last release before implementing a changelog.
