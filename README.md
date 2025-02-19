![RJLCodes](https://rjl.codes/img/logo.webp)
# RJLCustom404
RJLCustom404 was a project created for **simple** creation of 404 error handling pages. Offloading the html, css and images to create a simple 404 handler.

An interactive page where you can see how your confiruation changes the 404 page in real-time can be found at [RJL.codes](https://rjl.codes/)

## Description

If you are an expert in html/css and love to create creative 404 pages, this project is not for you. This is for developers who want a quick easy way to create 404 pages.

## Getting Started

This javascript library does not care what http server you use to load your website. You just need to create a custom 404 handler on your domain. In this simple example I am using IIS that is handling one web site.

IIS uses a file called web.config. In this simple example you will want to create the web.config file at the root / of your website. The specific structure you want to focus on is the **httpErrors** section.
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
In this section **path="/errors/404.htm"** meaning on the root of the server, in a folder called /errors/ there is a static html file called 404.htm (this can be called whatever you want). Create this empty 404.htm file.
Edit the 404.htm file and add the following code
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
</head>
<body>
<script>
  RJLCustom404({
    //Your custom options here
  });
</script>
</body>
</html>
```

## Options
:art: All color options support rgb(255, 255, 255), HEX #333 short code, HEX #f8f8f8 long code, hsl(9, 100%, 64%), or the actual color name "blue".

| Option | Type | Default | Description |
|---|---|---|---|
| `pageTitle` | `string` | `"404 - Not Found"` | Value of the HTML Page Title |
| `bodyBackgroundColor` | `string` | `"white"` | `body` color, essentially the background color |
| `bodyFontColor` | `string` | `"black"` | Font color |
| `automatic404Image` | `boolean` | `false` | `true` will automatically display one of our 404 images `false` requires you to define the 404 images |
| `imgFileNames` | `array` | `["/errors/404-1.webp", "/errors/404-2.webp", "/errors/404-3.webp"]` | Array of images to be loaded from your website in the format of ["YOUR_DOT_COM/PATH/FILE_NAME.EXTENSION"] |
| `imgBoxShadow` | `boolean` | `false` | Display a shadow around the image |
| `imgBoxShadowSize` | `string` | `"5px"` | Size in pixels of shadow |
| `imgBoxShadowColor` | `string` | `"rgba(255, 255, 255, 1)"` | Shadow color, including Opacity (1=100%, 0.5=50%) |
| `btnColor` | `string` | `"blue"` | Color of the action button to users |
| `btnDisplayText` | `string` | `"Back to"` | Text action button |
| `btnDisplayHostName` | `boolean` | `true` | Display the hostname after Display Text |
| `actionIsBtn` | `boolean` | `true` | `true` action is a button `false` action is a standard link |
| `btnPulsate` | `boolean` | `true` | Pulsate button to grab attention |
| `btnPulsateCount` | `number` | `2` | Number of times to pulsate |
| `headerText` | `string` | `"404 - File not found"` | Text that appears with the image `h3` |  |
| `subHeaderText` | `string` | `""` | Text that appears under the Header Text `p` |
| `headerTextPosition` | `string` | `"top"` | `top` displays text above the image `left` displays text to the left of image `right` displays text to the right of the image |

## Project Assistance
This project is tested with BrowserStack  [https://www.browserstack.com/](https://www.browserstack.com/)

## End