# Changelog

All notable changes to RJLCustom404 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file was started on 07-27-2026. Releases before that were not tracked here; the
"Earlier history" section at the bottom summarizes them from this repository's commit
log and carries no version numbers, because none were assigned at the time.

## [1.3.1] - 11-07-2026 at 6:25pm

### Changed

- US English spelling sweep: 1 British spelling in 1 file(s) changed to US forms (`behaviour` -> `behavior`). Comments, docs and page copy only; no behavior change.

## [1.3.0] - 09-18-2026 at 5:58pm

Every change in this release is backward compatible. A page that worked with 1.2.x renders
identically with 1.3.0 unless it opts into one of the new options.

### Added
- `RJLCustom404.version` - the library version string, for support and cache-bust checks.
- `homeUrl` option (default `"/"`) - where the button, the plain link and the image link
  point. Sites served from a subfolder can now send visitors to the right root.
- `imgAlt` option (default `"404 Error"`) - the alt text of the rendered image, for
  accessibility and localisation.
- A preserved banner comment at the top of both shipped files:
  `/*! RJLCustom404 v1.3.0 | https://rjl.codes | MIT */`.

### Fixed
- After `refreshImage()`, an image that failed to load reported the ORIGINAL file name in the
  `[[ <path> not found ]]` placeholder. It now names the file that actually failed.
- Calling `RJLCustom404()` more than once on the same page registered a new `resize` listener
  each time. The previous listener is now removed on re-render.
- The sub-header auto-lightening to `#666` recognised `black`, `#000` and `rgb(0, 0, 0)` but
  not `#000000` or `rgb(0,0,0)`. All spellings are now treated the same.
- Passing `imgCount: 0` explicitly (the documented "off" value) logged a validation warning.
  Zero is now treated as unset, silently.
- `headerTextColor` and `subHeaderTextColor` were not type-checked; a non-string value is now
  dropped with a warning like every other option.

### Changed
- The declared default of `headerTextPosition` is now `"right"`. This is a documentation fix,
  not a behaviour change: the previous declared default of `"top"` was never applied, and an
  unset option has always rendered the side-by-side layout (image left, text right). Pass
  `"top"` explicitly for a stacked page. One side effect is a genuine fix: an unset option
  that had collapsed to a single column below 768px now returns to a row when the viewport
  grows again.

### Documentation
- When `autoText` picks the button label it also decides whether the hostname is appended,
  overriding `btnDisplayHostName` for that render. This has always been the behaviour; it is
  now documented rather than silent.
- The repository now ships the readable source as `custom404.js` and the minified build as
  `custom404.min.js`. The starter template is `404.html` (was `404.htm`) and uses the guarded
  call with a static fallback. `LICENSE` is MIT, matching every other reference to the
  license. `README.md` rewritten; the options table is generated from the same source that
  renders https://rjl.codes/docs/options/ so the two cannot drift.

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
