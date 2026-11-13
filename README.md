<p align="center">
  <img src="https://rjl.codes/img/readme-hero.png" alt="RJLCustom404 - beautiful 404 pages in one line of JavaScript" width="800">
</p>

<p align="center">
  <a href="https://github.com/rjlsoftware/RJLCustom404/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-004494" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/dependencies-0-00949e" alt="Zero dependencies">
  <img src="https://img.shields.io/badge/version-1.3.1-004494" alt="Version">
  <a href="https://rjl.codes/error/404/custom404.js"><img src="https://img.shields.io/badge/hosted-rjl.codes-f7c600" alt="Hosted on rjl.codes"></a>
  <a href="https://rjl.codes/playground/"><img src="https://img.shields.io/badge/try_it-playground-00949e" alt="Playground"></a>
</p>

# RJLCustom404

**Beautiful 404 pages in one line of JavaScript.**

RJLCustom404 is a free, zero-dependency script that turns an empty `404.html` into a finished,
on-brand error page: your images, your colors, a way home. Include it, call it, ship it. No build
step, no framework, no CSS to write.

Every site has a 404 page. Most are the server's default, or a blank page someone meant to fix
later. A good one takes an afternoon: layout, responsive rules, an image, a way back. This makes it
a 30-second job. If you want to hand-craft a bespoke 404 with your own CSS, you do not need this.
If you want a good one in the next minute, you do.

Docs, options reference, live playground and FAQ: **https://rjl.codes/**

## 60-second quick start

**Hosted (nothing to download)** - paste before `</head>` in your `404.html`:

```html
<script src="https://rjl.codes/error/404/custom404.js?v=RJL_1.3.1"></script>
<script>RJLCustom404({ imgFileNames: ["/img/404.png"] });</script>
```

Do not add an `integrity=` attribute. The file is updated in place behind a stable URL, so a pinned
hash would silently block it and your 404 page would render blank. The `?v=` query string is a
cache-buster: bump it whenever you want browsers to fetch a fresh copy.

**Self-hosted** - copy `custom404.min.js` from this repository to your site and reference it instead:

```html
<script src="/js/custom404.min.js?v=1.3.1"></script>
```

`custom404.js` is the readable source (with the validation warnings intact); `custom404.min.js` is
the same file minified. Both carry a version banner on line 1.

## What it renders

One call to `RJLCustom404({ ... })` appends a responsive container to `<body>` with:

- the page title (`document.title`)
- an `<h3>` heading and an optional sub-heading
- one of YOUR images, picked at random, cycled without repeats and remembered per visitor
- a "Back to your-site.com" button (or a plain link) pointing home
- body background and text colors, and a layout that stacks on phones

Every option is optional. With no options at all you get the default text, a blue button and a
`[[ No 404 image configured ]]` placeholder where the image would be - there are no bundled images.

## A complete 404.html

Copy this file, change the image paths, put it at your site root. Done.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>404 - Page not found</title>
  <!-- No integrity= attribute: the file changes behind a stable URL and a pinned hash would block it -->
  <script src="https://rjl.codes/error/404/custom404.js?v=RJL_1.3.1"></script>
</head>
<body>
  <!-- Static fallback: only visible if the script is blocked or unreachable -->
  <div id="fallback-404">
    <h1>Page not found</h1>
    <p>Sorry, that page does not exist.</p>
    <p><a href="/">Return to the home page</a></p>
  </div>

  <script>
    if (typeof RJLCustom404 === "function") {
      var fb = document.getElementById("fallback-404");
      if (fb) fb.parentNode.removeChild(fb);
      RJLCustom404({
        autoText: true,
        imgPattern: "/img/404-{n}.png",
        imgCount: 4,
        imgBorderRadius: "24px",
        btnColor: "#004494"
      });
    }
  </script>
</body>
</html>
```

`noindex` keeps the error page out of search results. If your site runs analytics, paste the same
tags into this file so broken-link traffic lands in your dashboards.

## Recommended: the guarded call with a static fallback

The library generates the entire visible body of the page. If the script is ever blocked - an ad
blocker, a strict CSP, a network hiccup, a stale `integrity` hash - an unguarded call throws
`RJLCustom404 is not defined` and the visitor sees a blank page that still returns HTTP 404, so
nothing in your monitoring notices. Two lines fix that: a plain fallback block and a `typeof` guard.

```html
<div id="fallback-404">
  <h1>Page not found</h1>
  <p>Sorry, that page does not exist.</p>
  <p><a href="/">Return to the home page</a></p>
</div>

<script>
  if (typeof RJLCustom404 === "function") {
    var fb = document.getElementById("fallback-404");
    if (fb) fb.parentNode.removeChild(fb);
    RJLCustom404({ /* your options */ });
  }
</script>
```

The library appends to `<body>` and never clears it, which is why the fallback removes itself. Keep
the fallback plain: it exists for the failure case only.

## Options

All 27 options are optional. Color options accept any CSS color (`#004494`, `rgb()`, `hsl()`, a
named color); length options accept any CSS length. A value of the wrong type is ignored and the
default is used. Full reference with examples and "try it" links: https://rjl.codes/docs/options/

<!-- OPTIONS:start -->

### Page and body

The document title, the body colors and the autoText switch.

| Option | Type | Default | Description |
|---|---|---|---|
| `pageTitle` | string | `"404 - Not Found"` | Browser tab title (document.title). Sets document.title when the page renders. With autoText: true, leave it unset to receive a random title. |
| `bodyBackgroundColor` | string | `"white"` | Page background color. Applied as background-color on &lt;body&gt;. Pair a dark value with a light bodyFontColor. |
| `bodyFontColor` | string | `"black"` | Page text color. Applied as color on &lt;body&gt;. When it is black ("black", "#000", "#000000" or "rgb(0, 0, 0)") the sub-header is auto-lightened to #666 unless subHeaderTextColor is set. |
| `autoText` | boolean | `false` | Fill unset text fields from the built-in phrase pools. When true, any of pageTitle, headerText, subHeaderText and btnDisplayText that you did not set is filled from a shuffled pool of 50 phrases: no repeats until the pool is exhausted, remembered per hostname in localStorage. Fields you set always win, and an empty string counts as set. When the button label is auto-picked, the phrase also decides whether the hostname is appended, overriding btnDisplayHostName for that render. |

### Images

Which images you host, how they are picked, and how they look.

| Option | Type | Default | Description |
|---|---|---|---|
| `imgFileNames` | array | `[] (no image)` | The images you host. One is picked at random on each load. With two or more, the shuffle queue is stored in localStorage so a visitor sees every image before any repeat. No images are bundled: unset or empty renders [[ No 404 image configured ]], and a file that fails to load renders [[ &lt;path&gt; not found ]]. Takes precedence over imgPattern. |
| `imgPattern` | string | `"" (off)` | Path template for numbered images. Generates imgFileNames from a template. {n} is replaced by the number; {nn} and {nnn} zero-pad to that width. Requires imgCount. Ignored when imgFileNames is set. |
| `imgCount` | number | `0 (off)` | How many images the pattern generates. Number of paths produced from imgPattern, starting at imgStartIndex. Zero means unset. |
| `imgStartIndex` | number | `1` | First number used by the pattern. Use 0 for zero-based file names. Must be 0 or greater. |
| `imgBorderRadius` | string | `"50%"` | Corner radius of the image. Applied inline as border-radius. 50% makes a square image circular; 0 keeps square corners. |
| `imgBoxShadow` | boolean | `false` | Show a shadow when the image is hovered. When true, hovering the image shows box-shadow: 0 0 25px &lt;imgBoxShadowSize&gt; &lt;imgBoxShadowColor&gt; and the image settles from scale 1.05 to 1.02. |
| `imgBoxShadowSize` | string | `"5px"` | Spread of the hover shadow. The spread value of the hover shadow; the blur is fixed at 25px. Only used when imgBoxShadow is true. |
| `imgBoxShadowColor` | string | `"rgba(18, 0, 100, .4)"` | Color of the hover shadow. Use rgba() or an 8-digit hex to control opacity. Only used when imgBoxShadow is true. |
| `maxImgWidth` | string | `"1000px"` | Maximum width of the image column. Applied as max-width on the image container. The image scales down inside it and never exceeds the column. |
| `imgResponsiveBreakpoints` | boolean | `true` | Re-flow the layout on small screens. When true, a resize handler collapses left/right layouts to a single column at 768px and below and tightens the container padding at 480px and below. Font sizes and button padding always adapt through CSS regardless of this setting. |
| `imgAlt` | string | `"404 Error"` | Alt text of the image. The alt attribute of the rendered image, for screen readers and for the text shown if the image cannot be displayed. |

### Button

The way home: a button or a plain link, its label and its destination.

| Option | Type | Default | Description |
|---|---|---|---|
| `actionIsBtn` | boolean | `true` | Render a button or a plain link. true renders a &lt;button class="custom404-button"&gt; that navigates to homeUrl on click; false renders an underlined &lt;a&gt; in the surrounding text color. btnColor, btnPulsate and btnPulsateCount only apply to the button. |
| `btnColor` | string | `"blue"` | Button background color. Applied as background-color on the button. The button text is always white, so choose a color with enough contrast. |
| `btnPulsate` | boolean | `true` | Pulse the button on load. When true, the button scales from 1 to 1.1 and back over 2 seconds, btnPulsateCount times. |
| `btnPulsateCount` | number | `2` | How many times the button pulses. Number of 2-second pulse cycles. 0 disables the animation even when btnPulsate is true. Must be 0 or greater. |
| `btnDisplayText` | string | `"Back to"` | Button or link label. With btnDisplayHostName true the hostname is appended after a space, for example "Back to your-site.com". With autoText, leave it unset to receive a random label. |
| `btnDisplayHostName` | boolean | `true` | Append the hostname to the label. Appends window.location.hostname to btnDisplayText. Overridden per render when autoText picks the label. |
| `homeUrl` | string | `"/"` | Where the button, link and image point. The destination of the button, the plain link and the image link. Defaults to the site root; set it when your site lives in a subfolder or you want to send visitors somewhere more useful than the home page. |

### Header and text

The heading, the sub-heading, their colors and where the text block sits.

| Option | Type | Default | Description |
|---|---|---|---|
| `headerText` | string | `"404 - File not found"` | Main heading. Rendered as &lt;h3 class="custom404-header"&gt;. With autoText, leave it unset to receive a random heading. |
| `subHeaderText` | string | `"" (hidden)` | Paragraph under the heading. Rendered as &lt;p class="custom404-subheader"&gt; only when non-empty. With autoText, an explicit empty string keeps it hidden. |
| `headerTextColor` | string | `"" (inherits bodyFontColor)` | Heading color. Applied inline to the heading. Empty inherits bodyFontColor. |
| `subHeaderTextColor` | string | `"" (auto)` | Sub-heading color. Applied inline to the sub-heading. Empty uses bodyFontColor, lightened to #666 when bodyFontColor is black. |
| `headerTextPosition` | string | `"right"` | Where the text sits relative to the image. "right": image on the left, text on the right. "left": text on the left, image on the right. "top": text above the image. Left and right collapse to a single column at 768px and below. Invalid values fall back to the default. Before 1.3.0 the source declared "top" as the default but never applied it, so an unset option has always rendered the side-by-side layout. The declared default now matches what renders. |

_27 options. This table is generated from the same source that renders https://rjl.codes/docs/options/, so the two never drift._
<!-- OPTIONS:end -->

Notes:

- `headerTextPosition` renders `"right"` (image on the left, text on the right) when unset. Pass
  `"top"` explicitly for a stacked page. Left and right collapse to a single column at 768px and below.
- `imgBoxShadowSize` is the shadow's spread; the blur is fixed at 25px.
- `imgResponsiveBreakpoints` only gates the JavaScript that collapses side-by-side layouts on
  small screens; the font-size and padding breakpoints are always applied through CSS.
- Validation warnings are written with `console.warn` in `custom404.js`; `custom404.min.js` strips
  them, so debug against the readable file.

## autoText

```js
RJLCustom404({ autoText: true, imgPattern: "/img/404-{n}.png", imgCount: 6 });
```

Turn on `autoText` and any text you did not set is filled from four pools of 50 phrases: page title,
heading, sub-heading and button label. Each pool is shuffled (Fisher-Yates), drawn without repeats
until it is empty, then reshuffled; the queue is stored in localStorage per hostname so a returning
visitor keeps seeing new phrases. Half of the button labels append your hostname
(`Back to your-site.com`), half stand alone (`Beam me up!`). When autoText picks the label it also
decides whether the hostname is appended, overriding `btnDisplayHostName` for that render. A field
you set yourself always wins; `subHeaderText: ""` counts as set and keeps the sub-heading hidden.

## Images

- **There are no bundled images.** Every image is served from your site (or any host that serves
  it to your origin, like any `<img>`). Unset or empty renders `[[ No 404 image configured ]]`; a
  file that fails to load renders `[[ /path/to/file.png not found ]]` so you can read the exact path.
- **A list:** `imgFileNames: ["/img/404-a.png", "/img/404-b.png"]`
- **A numbered pattern:** `imgPattern: "/img/404-{n}.png", imgCount: 6` gives `404-1.png` through
  `404-6.png`. `{nn}` and `{nnn}` zero-pad (`404-01.png`); `imgStartIndex: 0` starts at zero.
  `imgPattern` needs `imgCount`. If both a list and a pattern are set, the list wins.
- One image is chosen at random on every load. With two or more, the shuffle queue is stored in
  localStorage so a visitor sees every image before any repeat.
- `imgBorderRadius` (default `"50%"`), `imgBoxShadow` + `imgBoxShadowSize` + `imgBoxShadowColor`
  (hover shadow), `maxImgWidth` (default `"1000px"`) and `imgAlt` shape how it looks.

## JavaScript API

| Member | What it does |
|---|---|
| `RJLCustom404(options)` | Renders the page. Calling it again removes the previous render and draws fresh (this is how the playground works). |
| `RJLCustom404.refreshImage()` | Swaps in the next image from the shuffle queue. No-op while the placeholder is showing. |
| `RJLCustom404.version` | The library version string, e.g. `"1.3.0"`. |

## CSS hooks

The library injects its stylesheet when it runs, so it lands after your own `<style>`. Give your
overrides slightly higher specificity, for example `body .custom404-button`.

| Selector | Element |
|---|---|
| `.custom404-container` | Outer flex wrapper appended to `<body>` (`max-width: 1200px`) |
| `.custom404-img-container` | Image column (`max-width` = `maxImgWidth`) |
| `#goHomeLink` | `<a>` wrapping the image, pointing at `homeUrl` (only when an image is configured) |
| `.custom404-img` | The `<img>` (`border-radius` set inline from `imgBorderRadius`) |
| `.custom404-img-missing` | The `[[ ... ]]` placeholder, also `data-custom404-missing="true"` |
| `.custom404-text-container` | Text column |
| `.custom404-header` | `<h3>` heading |
| `.custom404-subheader` | `<p>` sub-heading (only when `subHeaderText` is non-empty) |
| `.custom404-button` | `<button>` (only when `actionIsBtn: true`; the plain link has no class) |
| `style[data-custom404]` | The injected stylesheet, including a global `* { box-sizing: border-box }` |

Right-click is blocked on the container and dragging is blocked on the image.

## localStorage

No cookies, nothing sent anywhere. If storage is unavailable the shuffle still works within a page
load; it just does not remember across reloads.

| Key | Written when | Value |
|---|---|---|
| `rjl404_<hostname>_image` | Two or more images configured | `{ queue, last, src }` - the remaining shuffle queue, discarded when the image set changes |
| `rjl404_<hostname>_text` | `autoText: true` | `{ titles, headers, subHeaders, btnTexts }` - the remaining shuffled phrase pools |

## Server setup

Whatever the host, the page must still return HTTP 404. Do not redirect missing URLs to the home
page: search engines treat that as a soft 404 and visitors lose the context of what they were
looking for. Full walkthrough with copy-paste config: https://rjl.codes/docs/#server-setup

| Host | What to do |
|---|---|
| Cloudflare Pages | `404.html` at the root of the output directory (must be `.html`, not `.htm`) |
| Netlify | `404.html` at the publish root, or `/* /404.html 404` in `_redirects` |
| Vercel | `404.html` at the output root for static sites; frameworks with their own 404 route call the library from that route |
| GitHub Pages | `404.html` at the publishing source root; project sites live under `/repo-name/`, so use absolute image paths that include it |
| Apache | `ErrorDocument 404 /404.html` in `.htaccess` |
| nginx | `error_page 404 /404.html;` in the `server` block |
| IIS | An `<httpErrors>` entry in `web.config` pointing at `/404.html` |
| Express | `app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "public", "404.html")))` after every other route |

## Browser support

Every evergreen browser: Chrome, Edge, Firefox and Safari on desktop and mobile. The source uses
ES2017 features (`let`/`const`, template literals, spread, `String.prototype.padStart`), so Internet
Explorer is not supported.

## Upgrading from 1.x

- **1.2.0** removed the bundled images. Set `imgFileNames` or `imgPattern` + `imgCount`, or you
  will see `[[ No 404 image configured ]]`.
- **1.3.0** is fully backward compatible. It adds `homeUrl`, `imgAlt` and `RJLCustom404.version`,
  fixes four small bugs, and corrects the documented default of `headerTextPosition` to `"right"`
  (what an unset option has always rendered).
- The hosted file is updated in place. Bump `?v=` in your script tag to make browsers refetch it.

Full history: [CHANGELOG.md](CHANGELOG.md).

## FAQ

License, size, CSP, frameworks, self-hosting, privacy and troubleshooting: https://rjl.codes/faq/

## Contributing and issues

Bugs and feature requests: [open an issue](https://github.com/rjlsoftware/RJLCustom404/issues).
Pull requests are welcome. Changes that could break an existing site are avoided: new behavior
ships as new optional options with backward-compatible defaults, because this file is loaded at
runtime by sites that never rebuild.

## License

MIT - see [LICENSE](LICENSE). Copyright (c) 2025-2026 RJ Lindelof.
