![RJLCodes](https://rjl.codes/img/logo.webp)
# :rocket: RJLCustom404.js
An interactive page where you can see how your configuration changes the 404 page in real-time can be found at [RJL.codes](https://rjl.codes/)

### :pushpin: Overview
RJLCustom404 is a lightweight and dynamic **404 error page generator** that allows users to customize error page content, styles, and images effortlessly. It supports **randomized images**, dynamic text, button options, and easy integration into any website. If you are an expert in html/css and love to be creative, this project is not for you. This is for developers who want a quick easy way to create 404 pages.

### :sparkles: Features
- **Dynamic 404 Images**: Use custom image lists or enable `automatic404Image` to randomize from a preset collection.
- **Fully Customizable**: Modify background, text, buttons, and image styles.
- **Automatic Image Rotation**: Ensures a unique 404 image each time.
- **One-Click Image Refresh**: Provides a built-in method to refresh images dynamically while previewing.
- **Lightweight & Standalone**: No dependencies—just include the script.

## :boom: Basic Usages
```
<script src="custom404.js?v=0.0.1"></script>
<script>
  RJLCustom404({
    //No options uses defaults
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

        automatic404Image: true,       // Automatically generate 404 images
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


## :triangular_flag_on_post: Getting Started

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
In this section **path="/errors/404.htm"** meaning on the root of the server, in a folder called /errors/ there is a static html file called 404.htm (this can be called whatever you want). You can use the 404.htm file in this repository to start.

## :wrench: Options
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

## :question: More Information

An interactive page where you can see how your confiruation changes the 404 page in real-time can be found at [RJL.codes](https://rjl.codes/)

## :raising_hand: Project Assistance
This project is tested with BrowserStack  [https://www.browserstack.com/](https://www.browserstack.com/)

## :+1: End
