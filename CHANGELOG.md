# Changelog

All notable changes to RJLCustom404 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file was started on 07-27-2026. Releases before that were not tracked here; the
"Earlier history" section at the bottom summarizes them from this repository's commit
log and carries no version numbers, because none were assigned at the time.

## [1.2.1] - 07-27-2026 at 4:05pm

### Fixed
- Every image path in `README.md` pointed at a `.webp` file that no longer exists. The
  header image `https://rjl.codes/img/logo.webp` was a live 404 on this page, and the
  10 `.webp` example paths in the usage snippets and in the `imgFileNames` /
  `imgPattern` option rows suggested a format the project no longer publishes. All now
  read `.png`.

### Added
- This changelog.

No library code changed in this release. `custom404.js` is byte-identical to 1.2.0.

## [1.2.0] - 06-09-2026 at 11:37am

### Changed - BREAKING
- **No bundled default images.** `imgFileNames` now defaults to `[]` and the library
  ships no images of its own. Every site must self-host the images it wants to show.
  There is no fallback set to inherit.

### Added
- A text placeholder is rendered in place of a missing image rather than leaving a
  blank gap: `[[ No 404 image configured ]]` when no image is configured, and
  `[[ <path> not found ]]` when a configured image fails to load. The placeholder
  element carries the class `custom404-img-missing` so it can be styled or hidden.

### Documentation
- `README.md` synced to the full set of 25 configuration options.

### Upgrading from an earlier version
If your page relied on the bundled images, set `imgFileNames` (or `imgPattern` plus
`imgCount`) to images you host yourself. A page that sets neither will render the
`[[ No 404 image configured ]]` placeholder instead of an image.

---

## Earlier history

Summarized from the commit log. These predate this changelog and were never assigned
version numbers.

**04-30-2025** - Responsive images. Added two options: `maxImgWidth` and
`imgResponsiveBreakpoints`.

**02-19-2025** - Changed the default for the image box-shadow and removed stale inline
comments. `README.md` gained guidance on 404 handling best practices, a basic usage
example, a custom-options example, and an Apache configuration example.

**02-19-2025** - Added a starter 404 template to the repository. Introduced a `base_url`
constant for automatic image loading, and made user-supplied image arrays shuffle
uniquely so the same image does not repeat back to back. The watermark stopped being
applied to user-supplied images and applied only to library-hosted ones. (Watermarking
was removed from the library entirely in a later release.)

**02-18-2025** - Initial public repository, `README.md`, and a link to the live
configurator at https://rjl.codes.
