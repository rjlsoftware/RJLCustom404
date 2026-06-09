
![RJLCodes](https://rjl.codes/img/logo.webp)
# :rocket: RJLCustom404.js
An interactive page where you can see how your configuration changes the 404 page in real-time can be found at [RJL.codes](https://rjl.codes/)

### :pushpin: Overview
RJLCustom404 is a lightweight and dynamic **404 error page generator** that allows users to customize error page content, styles, and images effortlessly. It supports **randomized images**, dynamic text, button options, and easy integration into any website. If you are an expert in html/css and love to be creative, this project is not for you. This is for developers who want a quick easy way to create 404 pages.

### :sparkles: Features
- **Bring-your-own images**: Provide an explicit image list, or a numbered `{n}`/`{nn}`/`{nnn}` pattern, and the script rotates through them with a Fisher-Yates shuffle (no repeats until the whole set is shown). The library bundles **no images of its own** - every image is served from your site.
- **Missing-image placeholder**: If you configure no images, or an image fails to load, a `[[ ... ]]` text placeholder appears in place of the image instead of a broken icon - so the gap is obvious to you, not your visitors' problem to decode.
- **`autoText`**: Optionally auto-fill the page title, header, sub-header, and button text from built-in pools of 50 phrases each (funny through professional), cycling without repeats. Any field you set yourself always wins.
- **Fully customizable**: Background and font colors, header/sub-header text and colors, header position, button color/text/pulsation, hostname display, border radius, and box shadow.
- **No repeats across reloads**: The shuffle queue is persisted in `localStorage` (domain-scoped) so visitors see every image and phrase before any repeat, even across full page reloads; it degrades gracefully when storage is unavailable.
- **One-click image refresh**: `RJLCustom404.refreshImage()` swaps in the next image - handy for live previews.
- **Lightweight & standalone**: No dependencies - just include the script and call one function.

### :boom: Basic Usages
```
<script src="custom404.js?v=0.0.1"></script>
<script>
  RJLCustom404({
    // Minimal usage. Provide imgFileNames (your own images) or you'll
    // see a [[ No 404 image configured ]] placeholder - the library hosts none.
    imgFileNames: ["/errors/1.webp", "/errors/2.webp"]
  });
</script>
```

or with some options

```
<script src="custom404.js?v=0.0.1"></script>
<script>
    RJLCustom404({
        pageTitle: "Hope Not Found",   // Custom Page Title
        bodyBackgroundColor: "#fff",   // Default body background color
        bodyFontColor: "black",        // Default font color

        imgFileNames: ["/errors/1.webp", "/errors/2.webp"], // Your own images
        imgBorderRadius: "10%",        // Custom border radius
        imgBoxShadow: false,           // Disables the image shadow.

        actionIsBtn: false,           // Add action as plain text <a href>
        btnDisplayText: "Go back to ",// Text of action link (or button)
        btnDisplayHostName: true,     // Display the hostname after Display Text

        headerText: "You seem to be lost", // Custom header text
        headerTextPosition: "left",        // "top", "left", or "right"
        subHeaderText: "Try again..."      // Sub header text
    });
</script>
```

or let the library write the text for you and generate image paths from a pattern

```
<script src="custom404.js?v=0.0.1"></script>
<script>
    RJLCustom404({
        autoText: true,                       // Random title/header/sub-header/button text
        imgPattern: "/errors/404-{n}.webp",   // Generates /errors/404-1.webp ...
        imgCount: 10                          // ... through /errors/404-10.webp
    });
</script>
```

## :wrench: Options
:art: All color options accept rgb(255, 255, 255), HEX #333 or #f8f8f8, hsl(9, 100%, 64%), or a CSS color name like "blue".

### Page & Body
| Option | Type | Default | Description |
|---|---|---|---|
| `pageTitle` | `string` | `"404 - Not Found"` | Browser tab title (`document.title`) |
| `bodyBackgroundColor` | `string` | `"white"` | Page background color |
| `bodyFontColor` | `string` | `"black"` | Page text color. When `"black"`, the sub-header auto-lightens to `#666` |
| `autoText` | `boolean` | `false` | Auto-fill `pageTitle`, `headerText`, `subHeaderText`, and `btnDisplayText` from built-in 50-phrase pools (cycling, no repeats). Any field you set yourself takes priority |

### Images
| Option | Type | Default | Description |
|---|---|---|---|
| `imgFileNames` | `array` | `[]` (none) | Array of image paths YOU host, e.g. `["/path/a.webp", "/path/b.webp"]`. No bundled/default images. If unset/empty - or if a file fails to load - a `[[ ... ]]` text placeholder is shown in place of the image |
| `imgPattern` | `string` | `""` (disabled) | Path template for numbered images using a `{n}` placeholder (`{nn}`/`{nnn}` for zero-padding), e.g. `"/errors/404-{n}.webp"`. Requires `imgCount`. Ignored if `imgFileNames` is set |
| `imgCount` | `number` | `0` (disabled) | How many images to generate from `imgPattern`. Requires `imgPattern` |
| `imgStartIndex` | `number` | `1` | Starting number for `imgPattern` generation (use `0` for 0-based) |
| `imgBorderRadius` | `string` | `"50%"` | CSS border-radius applied to the image |
| `imgBoxShadow` | `boolean` | `false` | Enable a shadow on image hover |
| `imgBoxShadowSize` | `string` | `"5px"` | Shadow blur radius |
| `imgBoxShadowColor` | `string` | `"rgba(18, 0, 100, .4)"` | Shadow color, including opacity (1 = 100%, 0.5 = 50%) |
| `maxImgWidth` | `string` | `"1000px"` | Maximum image width |
| `imgResponsiveBreakpoints` | `boolean` | `true` | Enable responsive image sizing at mobile/tablet breakpoints |

### Button / Action
| Option | Type | Default | Description |
|---|---|---|---|
| `actionIsBtn` | `boolean` | `true` | `true` renders a `<button>`; `false` renders a plain text `<a>` link |
| `btnColor` | `string` | `"blue"` | Button background color |
| `btnPulsate` | `boolean` | `true` | Pulse the button to grab attention |
| `btnPulsateCount` | `number` | `2` | Number of pulse cycles (`0` = no animation) |
| `btnDisplayText` | `string` | `"Back to"` | Button (or link) label text |
| `btnDisplayHostName` | `boolean` | `true` | Append the site hostname after the label |

### Header & Text
| Option | Type | Default | Description |
|---|---|---|---|
| `headerText` | `string` | `"404 - File not found"` | Main heading (`h3`) |
| `subHeaderText` | `string` | `""` (empty) | Secondary text below the heading (`p`). Empty = no sub-header |
| `headerTextColor` | `string` | `""` (inherits) | Custom heading color. Empty inherits `bodyFontColor` |
| `subHeaderTextColor` | `string` | `""` (auto) | Custom sub-header color. Empty auto-derives from `bodyFontColor` |
| `headerTextPosition` | `string` | `"top"` | Text placement relative to the image: `"top"`, `"left"`, or `"right"` |

## :triangular_flag_on_post: 404 Page Handling - Getting Started

This javascript library does not care what http server you use to load your website. You just need to create a custom 404 handler on your domain. In this simple example I am using IIS that is handling one web site.

 **- Cloudflare Pages (and most static hosts)**
Place a file named `404.html` at your site root. Cloudflare Pages automatically serves `/404.html` for any unmatched path - no configuration needed. Reference `custom404.js` from it and call `RJLCustom404({ ... })`. (Pages only serves `404.html`, not `404.htm`.)

 **- Apache Example**
While in the root directory, open the .htaccess file (or create one if missing). In the .htaccess file, add the record "ErrorDocument 404 /404.htm".

 **- IIS Example**
Via the IIS Services Manager, go to the "Error Pages" section and add a new error page with status code "404" and specify the path to your custom 404.htm page.

IIS uses a file called web.config. You can also create the web.config file at the root / of your website. The specific structure you want to focus on is the **httpErrors** section.
```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <httpErrors errorMode="Custom">
            <remove statusCode="404" subStatusCode="-1" />
            <error statusCode="404" prefixLanguageFilePath="" path="/errors/404.htm" responseMode="ExecuteURL" />
        </httpErrors>
    </system.webServer>
</configuration>
```
In this section **path="/errors/404.htm"** meaning on the root of the server, in a folder called /errors/ there is a static html file called 404.htm (this can be called whatever you want). You can use the 404.htm file in this repository to start.

## :question: More Information

An interactive page where you can see how your configuration changes the 404 page in real-time can be found at [RJL.codes](https://rjl.codes/)

## :+1: Best Practices
A 404 page is still a 404 page, so you should **not** set up a redirect for 404 pages. You shouldn't redirect users to an irrelevant page, such as the homepage. For SEO it is not a great practice (confuses users), and search engines mostly treat them as 404s anyway (they're soft-404s), so there's no upside. It's not critically broken/bad, but additional complexity for no good reason - make a better 404 page instead.

## :raising_hand: Project Assistance
This project is tested with BrowserStack  [https://www.browserstack.com/](https://www.browserstack.com/)
