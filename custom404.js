/*! RJLCustom404 v1.3.0 | https://rjl.codes | MIT */
/*
 * RJLCustom404 - beautiful 404 pages in one line of JavaScript.
 *
 * Renders a complete, responsive 404 page (title, heading, sub-heading, one of
 * YOUR images picked at random, and a way home) from a single call:
 *
 *   <script src="https://rjl.codes/error/404/custom404.js?v=RJL_1.3.0"></script>
 *   <script>RJLCustom404({ imgFileNames: ["/img/404.png"] });</script>
 *
 * Zero dependencies. No bundled images - host your own. MIT licensed.
 * Docs, options reference, playground and FAQ: https://rjl.codes/docs/
 * Source: https://github.com/rjlsoftware/RJLCustom404
 */
(function () {

    var LIB_VERSION = "1.3.0";

    // A working copy of user-defined images (shuffled)
    let shuffledUserImages = [];
    // Track last shown image to prevent back-to-back repeats at cycle boundary
    let lastShownImage = null;

    // Function to shuffle an array (Fisher-Yates Algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // ─── localStorage persistence (cross-reload shuffle queue) ─────
    var _imgStateLoaded = false;

    var _storageOk = (function () {
        try {
            var t = '__rjl404_test__';
            localStorage.setItem(t, '1');
            localStorage.removeItem(t);
            return true;
        } catch (e) {
            return false;
        }
    })();

    function getStorageKey(type) {
        return 'rjl404_' + window.location.hostname + '_' + type;
    }

    function loadState(key) {
        if (!_storageOk) return null;
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            try { localStorage.removeItem(key); } catch (e2) { }
            return null;
        }
    }

    function saveState(key, data) {
        if (!_storageOk) return;
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) { }
    }

    function getImageFingerprint(list) {
        return list.slice().sort().join('|');
    }

    // Auto-text arrays for autoText feature (50 entries each)
    const AUTO_PAGE_TITLES = [
        "404 - Reality Not Found",
        "404 - Gone Fishing",
        "404 - Plot Twist: No Page",
        "404 - The Void Stares Back",
        "404 - Nope, Not Here",
        "404 - Lost in Cyberspace",
        "404 - Digital Tumbleweeds",
        "404 - Abandon All Hope",
        "404 - Wrong Turn Ahead",
        "404 - The Great Vanishing",
        "404 - Page on Vacation",
        "404 - Ghost Page",
        "404 - Into the Unknown",
        "404 - Off the Map",
        "404 - Down the Rabbit Hole",
        "404 - Page Not Available",
        "404 - Content Missing",
        "404 - Resource Not Found",
        "404 - Page Unavailable",
        "404 - File Not Located",
        "404 - Destination Unknown",
        "404 - Missing Content",
        "404 - Not on This Server",
        "404 - Page Does Not Exist",
        "404 - Link Broken",
        "404 - Nothing Here",
        "404 - Content Removed",
        "404 - Page Relocated",
        "404 - Invalid Address",
        "404 - Document Not Found",
        "404 - Requested Page Missing",
        "404 - Out of Bounds",
        "404 - No Matches Found",
        "404 - Location Not Found",
        "404 - Endpoint Missing",
        "404 - Whoops! Dead End",
        "404 - Well, This Is Awkward",
        "404 - Looks Like a Dead Link",
        "404 - Page Took a Day Off",
        "404 - This Link Needs Coffee",
        "404 - Houston, We Lost a Page",
        "404 - Detour Required",
        "404 - You Zigged, Page Zagged",
        "404 - Turn Back, Traveler",
        "404 - Uncharted Territory",
        "404 - This Page Escaped",
        "404 - Bermuda Triangle of URLs",
        "404 - Warp Zone Malfunction",
        "404 - One Small Step, Wrong URL",
        "404 - The Page Has Left the Building"
    ];

    const AUTO_HEADER_TEXTS = [
        "Oops! You found a hole in the internet.",
        "This page ran away from home.",
        "Looks like someone moved the furniture.",
        "The page you wanted is playing hide and seek.",
        "Error 404: Enthusiasm not found.",
        "Well, this is embarrassing.",
        "We sent a search party. They got lost too.",
        "Plot twist: the page was inside you all along.",
        "This page called in sick today.",
        "You've reached the edge of the internet.",
        "The hamsters powering this page took a break.",
        "Our digital janitor swept this page away.",
        "This page left to find itself.",
        "Someone unplugged the internet here.",
        "This page is on a coffee break.",
        "Page Not Found",
        "The page you requested could not be found.",
        "This content is no longer available.",
        "We couldn't locate that page.",
        "The requested resource does not exist.",
        "This URL does not match any page on our site.",
        "Sorry, this page doesn't exist.",
        "We can't find the page you're looking for.",
        "The content at this address has been removed.",
        "This page has been moved or deleted.",
        "No page exists at this address.",
        "The link you followed may be outdated.",
        "This destination could not be reached.",
        "Sorry, nothing here.",
        "That page isn't available right now.",
        "The page you're after doesn't live here.",
        "Hmm, we can't seem to find that one.",
        "Looks like this page packed its bags.",
        "This page wandered off somewhere.",
        "Not the page you were hoping for.",
        "Somewhere, somehow, this page went missing.",
        "This content has vanished into thin air.",
        "End of the road. No page ahead.",
        "A wrong turn brought you here.",
        "Nothing to see here. Literally.",
        "404: File Not Found",
        "The resource could not be loaded.",
        "That link appears to be broken.",
        "This path leads nowhere.",
        "Requested content unavailable.",
        "We hit a dead end.",
        "This page seems to have wandered off.",
        "You've ventured into uncharted territory.",
        "The map says the page should be here...",
        "Uh-oh, this page went on an adventure."
    ];

    const AUTO_SUB_HEADER_TEXTS = [
        "Maybe try the homepage? It's lonely without you.",
        "The good news: everything else still works!",
        "We blame the intern. (Just kidding, we don't have one.)",
        "Even the best explorers take a wrong turn sometimes.",
        "If it helps, we're just as confused as you are.",
        "Fun fact: this page loads faster than the one you wanted.",
        "The page may have been abducted by aliens. We're investigating.",
        "On the bright side, you discovered our 404 page!",
        "This is not the URL you are looking for.",
        "Somewhere a developer is frantically checking the logs.",
        "Quick, look busy while we figure this out.",
        "The page must be on the other internet.",
        "Try turning the URL off and on again.",
        "We'll file a missing page report right away.",
        "Don't worry, it happens to the best of URLs.",
        "The page you're looking for may have been moved or deleted.",
        "Please check the URL and try again.",
        "Use the button below to return to our homepage.",
        "The content at this address is no longer available.",
        "If you followed a link, it may be outdated.",
        "You can navigate back to find what you need.",
        "This page may have been removed during a recent update.",
        "Try searching our site or browse from the homepage.",
        "We apologize for the inconvenience.",
        "The resource you requested could not be located on this server.",
        "Please verify the address and try again.",
        "Return to the homepage to continue browsing.",
        "The URL may contain a typo. Double-check and retry.",
        "This link may have expired or been removed.",
        "We're sorry, but that page isn't here anymore.",
        "Head back and try a different path.",
        "Looks like you need a detour. Try the homepage.",
        "We couldn't match that URL to any content.",
        "Sorry about that! Use the link below to get back on track.",
        "Not to worry, there's plenty more to explore.",
        "This isn't where you meant to be, but we can help.",
        "Our records show this page no longer exists.",
        "It's possible the page was moved to a new location.",
        "Click below to head somewhere that actually exists.",
        "The internet is vast, and you just found an empty spot.",
        "Check your bookmarks, this address may have changed.",
        "Feel free to browse our other pages instead.",
        "We keep things tidy around here, and this page was swept up.",
        "The trail ends here. Let us point you in the right direction.",
        "Happens to everyone. Let's get you back on track.",
        "That page has gone to a better place. Try the homepage.",
        "The server couldn't find what you were after.",
        "No worries! Click the button and we'll take you home.",
        "Sometimes pages just disappear. This was one of them.",
        "Double-check the URL or head to the homepage."
    ];

    const AUTO_BTN_DISPLAY_TEXTS = [
        // 25 entries that append the hostname (withHost: true)
        { text: "Back to", withHost: true },
        { text: "Return to", withHost: true },
        { text: "Go back to", withHost: true },
        { text: "Head back to", withHost: true },
        { text: "Get back to", withHost: true },
        { text: "Go to", withHost: true },
        { text: "Head to", withHost: true },
        { text: "Navigate to", withHost: true },
        { text: "Continue to", withHost: true },
        { text: "Proceed to", withHost: true },
        { text: "Visit", withHost: true },
        { text: "Take me to", withHost: true },
        { text: "Let's go to", withHost: true },
        { text: "Carry on to", withHost: true },
        { text: "Hop back to", withHost: true },
        { text: "Bounce back to", withHost: true },
        { text: "Jump back to", withHost: true },
        { text: "Dash back to", withHost: true },
        { text: "Swing by", withHost: true },
        { text: "Pop over to", withHost: true },
        { text: "Cruise back to", withHost: true },
        { text: "Skip back to", withHost: true },
        { text: "Zip back to", withHost: true },
        { text: "Stroll back to", withHost: true },
        { text: "Find my way to", withHost: true },
        // 25 standalone entries (withHost: false)
        { text: "Get me outta here!", withHost: false },
        { text: "Go Home", withHost: false },
        { text: "Beam me up!", withHost: false },
        { text: "Abort mission!", withHost: false },
        { text: "Run away!", withHost: false },
        { text: "Panic!", withHost: false },
        { text: "Take me home", withHost: false },
        { text: "I want out!", withHost: false },
        { text: "Back to safety", withHost: false },
        { text: "Retreat!", withHost: false },
        { text: "Let's bounce", withHost: false },
        { text: "Nope, go back", withHost: false },
        { text: "Hit the eject button!", withHost: false },
        { text: "To the homepage!", withHost: false },
        { text: "Help, I'm lost!", withHost: false },
        { text: "Where's the exit?", withHost: false },
        { text: "I'm outta here", withHost: false },
        { text: "Make it stop!", withHost: false },
        { text: "Just go home", withHost: false },
        { text: "Wrong way!", withHost: false },
        { text: "This way out", withHost: false },
        { text: "Rescue me!", withHost: false },
        { text: "Find the exit", withHost: false },
        { text: "Escape!", withHost: false },
        { text: "Eject! Eject! Eject!", withHost: false }
    ];

    // Shuffled pools for auto-text cycling (Fisher-Yates, no repeats until all used)
    var shuffledPageTitles = [];
    var shuffledHeaderTexts = [];
    var shuffledSubHeaderTexts = [];
    var shuffledBtnDisplayTexts = [];

    // Pick a unique item from a shuffled pool (refills from source when exhausted)
    function pickRandom(shuffledPool, sourceArray) {
        if (shuffledPool.length === 0) {
            for (var i = 0; i < sourceArray.length; i++) {
                shuffledPool.push(sourceArray[i]);
            }
            shuffleArray(shuffledPool);
        }
        return shuffledPool.pop();
    }

    // Function to get a unique random image from user-defined list
    function getUniqueUserImage() {
        var imageList = getParam(globalOptions.imgFileNames, defaults.imgFileNames);

        // On first call, try to restore queue from localStorage
        if (!_imgStateLoaded) {
            _imgStateLoaded = true;
            if (imageList.length > 1) {
                var stored = loadState(getStorageKey('image'));
                if (stored && stored.src === getImageFingerprint(imageList)) {
                    if (Array.isArray(stored.queue)) {
                        shuffledUserImages = stored.queue;
                    }
                    if (stored.last) {
                        lastShownImage = stored.last;
                    }
                }
            }
        }

        if (shuffledUserImages.length === 0) {
            // If all user images have been used, reset and shuffle
            shuffledUserImages = [...imageList];
            shuffleArray(shuffledUserImages);
            // Prevent back-to-back repeat at cycle boundary
            if (shuffledUserImages.length > 1 && shuffledUserImages[shuffledUserImages.length - 1] === lastShownImage) {
                var lastIdx = shuffledUserImages.length - 1;
                var swapIdx = Math.floor(Math.random() * lastIdx);
                var temp = shuffledUserImages[lastIdx];
                shuffledUserImages[lastIdx] = shuffledUserImages[swapIdx];
                shuffledUserImages[swapIdx] = temp;
            }
        }

        lastShownImage = shuffledUserImages.pop();

        // Persist queue state (skip for single-image configs)
        if (imageList.length > 1) {
            saveState(getStorageKey('image'), {
                queue: shuffledUserImages,
                last: lastShownImage,
                src: getImageFingerprint(imageList)
            });
        }

        return lastShownImage;
    }

    // Default settings
    const defaults = {
        pageTitle: "404 - Not Found",
        imgBorderRadius: "50%",
        imgFileNames: [],      // No bundled images - host your own. Unset/empty/missing shows a [[ ]] text placeholder.
        imgPattern: "",        // Path template, e.g. "/errors/404-{n}.png"
        imgCount: 0,           // Number of images (0 = unset)
        imgStartIndex: 1,      // Starting number
        btnColor: "blue",
        btnPulsate: true,
        btnPulsateCount: 2,
        headerText: "404 - File not found",
        subHeaderText: "",
        autoText: false, // Enable random text for title, header, sub-header, button
        headerTextPosition: "right", // "top", "left", or "right" - unset has always rendered as "right"
        btnDisplayHostName: true, // Show hostname in button text
        btnDisplayText: "Back to", // Custom button text
        actionIsBtn: true, // Use <button> (true) or plain <a> text (false)
        imgBoxShadow: false, // Enable box shadow on hover
        imgBoxShadowSize: "5px", // Default shadow size
        imgBoxShadowColor: "rgba(18, 0, 100, .4)", // Default shadow color
        bodyBackgroundColor: "white", // Default body background color
        bodyFontColor: "black", // Default body font color
        headerTextColor: "", // Custom header text color (empty = inherit bodyFontColor)
        subHeaderTextColor: "", // Custom sub-header text color (empty = auto from bodyFontColor)
        maxImgWidth: "1000px", // Maximum image width
        imgResponsiveBreakpoints: true, // Enable responsive breakpoints
        imgAlt: "404 Error", // Alt text of the rendered image
        homeUrl: "/" // Where the button, the plain link and the image link point
    };

    // Function to get parameter or fallback to default
    function getParam(param, fallback) {
        return typeof param !== "undefined" ? param : fallback;
    }

    //Global variables to store options and image element
    let globalOptions = {}; // Store options for later use
    let rjlImageElement = null; // Store the image element
    var _resizeHandler = null; // The active resize listener, removed on re-render

    function getRandomImage() {
        return getUniqueUserImage();
    }

    // Function to set page title
    function setPageTitle(title) {
        document.title = getParam(title, defaults.pageTitle);
    }

    // Function to apply body styles (background and font color)
    function applyBodyStyles(options) {
        document.body.style.backgroundColor = getParam(options.bodyBackgroundColor, defaults.bodyBackgroundColor);
        document.body.style.color = getParam(options.bodyFontColor, defaults.bodyFontColor);
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.width = "100%";
        document.body.style.boxSizing = "border-box";
    }

    // Function to inject CSS (for hover effects and responsive styles)
    function injectCSS(options) {
        const style = document.createElement("style");
        style.setAttribute("data-custom404", "true");
        style.innerHTML = `
            @keyframes pulsate {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            * {
                box-sizing: border-box;
            }

            .custom404-container {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .custom404-text-container {
                width: 100%;
                max-width: 1000px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            .custom404-img-container {
                width: 100%;
                max-width: ${getParam(options.maxImgWidth, defaults.maxImgWidth)};
                margin: 0 auto;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .custom404-img {
                width: 100%;
                height: auto;
                transform: scale(1.05);
                transition: box-shadow 0.3s ease, transform 0.3s ease;
                display: block;
                margin: 20px auto;
            }

            .custom404-img-missing {
                font-family: monospace;
                font-size: 1.1em;
                color: #888;
                padding: 40px 20px;
                margin: 20px auto;
                text-align: center;
                word-break: break-all;
            }

            ${getParam(options.imgBoxShadow, defaults.imgBoxShadow) ? `
            .custom404-img:hover {
                box-shadow: 0 0 25px ${getParam(options.imgBoxShadowSize, defaults.imgBoxShadowSize)} ${getParam(options.imgBoxShadowColor, defaults.imgBoxShadowColor)};
                transform: scale(1.02);
            }` : ""}

            .custom404-header {
                font-size: 2em;
                margin: 10px 0;
            }

            .custom404-subheader {
                font-size: 1.2em;
                margin: 5px 0;
            }

            .custom404-button {
                background-color: ${getParam(options.btnColor, defaults.btnColor)};
                color: white;
                padding: 15px 30px;
                font-size: 1.2em;
                border: none;
                cursor: pointer;
                margin-top: 5px;
                border-radius: 10px;
            }

            /* Responsive breakpoints */
            @media screen and (max-width: 768px) {
                .custom404-header {
                    font-size: 1.8em;
                }

                .custom404-subheader {
                    font-size: 1.1em;
                }

                .custom404-button {
                    padding: 12px 24px;
                    font-size: 1.1em;
                }

                .custom404-img {
                    margin: 15px auto;
                }
            }

            @media screen and (max-width: 480px) {
                .custom404-header {
                    font-size: 1.5em;
                }

                .custom404-subheader {
                    font-size: 1em;
                }

                .custom404-button {
                    padding: 10px 20px;
                    font-size: 1em;
                    width: 100%;
                    max-width: 250px;
                }

                .custom404-img {
                    margin: 10px auto;
                }

                .custom404-container {
                    padding: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to create action element (button or plain text link)
    function createActionElement(options) {
        const displayText = getParam(options.btnDisplayText, defaults.btnDisplayText);
        const includeHost = getParam(options.btnDisplayHostName, defaults.btnDisplayHostName);
        const buttonText = includeHost ? `${displayText} ${window.location.hostname}` : displayText;
        const homeUrl = getParam(options.homeUrl, defaults.homeUrl);

        if (getParam(options.actionIsBtn, defaults.actionIsBtn)) {
            // Create a <button>
            const button = document.createElement("button");
            button.innerText = buttonText;
            button.title = `Go to ${window.location.hostname}`;
            button.onclick = () => window.location.href = homeUrl;
            button.className = "custom404-button";

            // Apply pulsating effect if enabled
            if (getParam(options.btnPulsate, defaults.btnPulsate)) {
                const pulsateCount = getParam(options.btnPulsateCount, defaults.btnPulsateCount);
                button.style.animation = pulsateCount === 0 ? "none" : `pulsate 2s ease-in-out ${pulsateCount} forwards`;
            }
            return button;
        } else {
            // Create a plain text <a> link (no button styling)
            const link = document.createElement("a");
            link.href = homeUrl;
            link.innerText = buttonText;
            link.title = `Go to ${window.location.hostname}`;
            link.style.color = "inherit"; // Matches surrounding text
            link.style.textDecoration = "underline"; // Keep it looking like a normal link
            link.style.fontSize = "1.2em";
            return link;
        }
    }

    // Build the text placeholder shown in place of the image when no image is
    // configured or a configured image fails to load. Wrapped in [[ ]] so the
    // missing-image state is unmistakable to the site owner.
    function createMissingPlaceholder(message) {
        var ph = document.createElement("div");
        ph.className = "custom404-img-missing";
        ph.setAttribute("data-custom404-missing", "true");
        ph.innerText = "[[ " + message + " ]]";
        return ph;
    }

    // Function to inject HTML
    function injectHTML(options) {
        // Create main container
        var container = document.createElement("div");
        container.className = "custom404-container";

        // Where the text block sits relative to the image. An unset option renders
        // exactly like "right" (image first, text second) - which is the default.
        var pos = getParam(options.headerTextPosition, defaults.headerTextPosition);

        // Set display flex direction based on header position
        container.style.display = "flex";
        container.style.flexDirection = pos === "top" ? "column" : "row";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.gap = "20px";

        if (pos === "left") {
            container.style.flexDirection = "row-reverse"; // Reverse for left alignment
        }

        // Create a wrapper for text elements
        var textContainer = document.createElement("div");
        textContainer.className = "custom404-text-container";
        textContainer.style.display = "flex";
        textContainer.style.flexDirection = "column";
        textContainer.style.alignItems = "center";
        textContainer.style.justifyContent = "flex-start";

        // Inject header
        var header = document.createElement("h3");
        header.className = "custom404-header";
        header.innerText = getParam(options.headerText, defaults.headerText);
        var headerTextColor = getParam(options.headerTextColor, defaults.headerTextColor);
        if (headerTextColor) {
            header.style.color = headerTextColor;
        }
        textContainer.appendChild(header);

        // Inject sub-header if provided
        var subHeaderText = getParam(options.subHeaderText, defaults.subHeaderText);
        if (subHeaderText) {
            var subHeader = document.createElement("p");
            subHeader.className = "custom404-subheader";
            subHeader.innerText = subHeaderText;

            var subHeaderTextColor = getParam(options.subHeaderTextColor, defaults.subHeaderTextColor);
            if (subHeaderTextColor) {
                subHeader.style.color = subHeaderTextColor;
            } else {
                // Fetch the body font color correctly using getParam()
                var bodyFontColor = getParam(options.bodyFontColor, defaults.bodyFontColor);
                // If font color is black, make subheader text a little lighter
                var blackSpellings = ["black", "#000", "#000000", "rgb(0, 0, 0)", "rgb(0,0,0)"];
                if (blackSpellings.indexOf(String(bodyFontColor).trim().toLowerCase()) !== -1) {
                    subHeader.style.color = "#666";
                } else {
                    subHeader.style.color = bodyFontColor; // Otherwise, use the specified color
                }
            }
            textContainer.appendChild(subHeader);
        }

        // Inject action (button or plain text link)
        textContainer.appendChild(createActionElement(options));

        // Create image container
        var imgContainer = document.createElement("div");
        imgContainer.className = "custom404-img-container";

        // Resolve the configured image list. RJLCustom404 hosts no images of its
        // own, so an unset/empty list means "no image" - show a text placeholder.
        var imageList = getParam(globalOptions.imgFileNames, defaults.imgFileNames);

        if (!Array.isArray(imageList) || imageList.length === 0) {
            // Nothing configured: render [[ No 404 image configured ]] in place of the image.
            rjlImageElement = null;
            imgContainer.appendChild(createMissingPlaceholder("No 404 image configured"));
        } else {
            // Inject image with dynamic border-radius, wrapped in a home link
            var imgLink = document.createElement("a");
            imgLink.href = getParam(options.homeUrl, defaults.homeUrl);
            imgLink.id = "goHomeLink";
            imgLink.title = "Go to " + window.location.hostname;
            imgLink.style.display = "block";
            imgLink.style.width = "100%";

            var imgSrc = getRandomImage();
            var img = document.createElement("img");
            img.src = imgSrc;
            img.alt = getParam(options.imgAlt, defaults.imgAlt);
            img.className = "custom404-img";
            img.style.borderRadius = getParam(options.imgBorderRadius, defaults.imgBorderRadius);

            // Prevent dragging
            img.ondragstart = function () { return false; };
            img.style.webkitUserSelect = "none";
            img.style.mozUserSelect = "none";
            img.style.msUserSelect = "none";
            img.style.userSelect = "none";

            // Missing image (file or directory): replace it with a
            // [[ <path> not found ]] text placeholder rather than a broken image.
            // Read the src off the element so that after refreshImage() the
            // placeholder names the file that actually failed.
            img.onerror = function () {
                var failedSrc = img.getAttribute("src") || imgSrc;
                console.warn("RJLCustom404: Image failed to load: " + failedSrc);
                var placeholder = createMissingPlaceholder(failedSrc + " not found");
                if (imgLink.parentNode) {
                    imgLink.parentNode.replaceChild(placeholder, imgLink);
                }
                rjlImageElement = null;
            };

            rjlImageElement = img;

            imgLink.appendChild(img);
            imgContainer.appendChild(imgLink);
        }

        // Append elements based on position
        if (pos === "top") {
            container.appendChild(textContainer);
            container.appendChild(imgContainer);
        } else {
            container.appendChild(imgContainer);
            container.appendChild(textContainer);
        }

        // Append to body
        document.body.appendChild(container);

        // Scope context menu prevention to the 404 container only
        container.addEventListener("contextmenu", function (event) {
            event.preventDefault();
        });

        // Add responsive handling for mobile. One listener per render: the
        // previous one is removed in removePreviousInstance().
        if (getParam(options.imgResponsiveBreakpoints, defaults.imgResponsiveBreakpoints)) {
            _resizeHandler = function () {
                handleResponsiveLayout(container, textContainer, imgContainer, options);
            };
            window.addEventListener("resize", _resizeHandler);

            // Initial call to set correct layout
            handleResponsiveLayout(container, textContainer, imgContainer, options);
        }
    }

    // Function to handle responsive layout changes
    function handleResponsiveLayout(container, textContainer, imgContainer, options) {
        var windowWidth = window.innerWidth;
        var pos = getParam(options.headerTextPosition, defaults.headerTextPosition);

        // Force column layout on mobile regardless of headerTextPosition setting
        if (windowWidth <= 768 && pos !== "top") {
            container.style.flexDirection = "column";
        } else if (pos === "left") {
            container.style.flexDirection = "row-reverse";
        } else if (pos === "right") {
            container.style.flexDirection = "row";
        }

        // Adjust margins and padding for small screens
        if (windowWidth <= 480) {
            container.style.padding = "10px";
            textContainer.style.marginBottom = "10px";
            imgContainer.style.marginTop = "10px";
        } else {
            container.style.padding = "20px";
            textContainer.style.marginBottom = "0";
            imgContainer.style.marginTop = "0";
        }
    }

    // Validate options and warn on invalid values
    function validateOptions(options) {
        var expectedTypes = {
            pageTitle: "string",
            imgBorderRadius: "string",
            btnColor: "string",
            btnDisplayText: "string",
            headerText: "string",
            subHeaderText: "string",
            headerTextPosition: "string",
            bodyBackgroundColor: "string",
            bodyFontColor: "string",
            maxImgWidth: "string",
            imgBoxShadowSize: "string",
            imgBoxShadowColor: "string",
            btnPulsate: "boolean",
            btnDisplayHostName: "boolean",
            actionIsBtn: "boolean",
            imgBoxShadow: "boolean",
            imgResponsiveBreakpoints: "boolean",
            autoText: "boolean",
            btnPulsateCount: "number",
            imgPattern: "string",
            imgCount: "number",
            imgStartIndex: "number",
            headerTextColor: "string",
            subHeaderTextColor: "string",
            homeUrl: "string",
            imgAlt: "string"
        };

        for (var key in expectedTypes) {
            if (typeof options[key] !== "undefined") {
                if (typeof options[key] !== expectedTypes[key]) {
                    console.warn("RJLCustom404: Option '" + key + "' should be " + expectedTypes[key] + " but got " + typeof options[key] + ". Using default.");
                    delete options[key];
                }
            }
        }

        // Validate imgFileNames is a non-empty array if provided.
        // There are NO fallback images: an unset/empty/non-array value renders a [[ ]] text placeholder.
        if (typeof options.imgFileNames !== "undefined") {
            if (!Array.isArray(options.imgFileNames)) {
                console.warn("RJLCustom404: Option 'imgFileNames' should be an array of image paths you host. No image will be shown.");
                delete options.imgFileNames;
            } else if (options.imgFileNames.length === 0) {
                console.warn("RJLCustom404: Option 'imgFileNames' is empty. No image will be shown.");
            }
        }

        // Validate headerTextPosition enum
        if (typeof options.headerTextPosition === "string") {
            var validPositions = ["top", "left", "right"];
            if (validPositions.indexOf(options.headerTextPosition) === -1) {
                console.warn("RJLCustom404: Option 'headerTextPosition' must be 'top', 'left', or 'right'. Got '" + options.headerTextPosition + "'. Using default.");
                delete options.headerTextPosition;
            }
        }

        // Validate btnPulsateCount is non-negative
        if (typeof options.btnPulsateCount === "number" && options.btnPulsateCount < 0) {
            console.warn("RJLCustom404: Option 'btnPulsateCount' must be non-negative. Using default.");
            delete options.btnPulsateCount;
        }

        // Validate imgCount when provided: 0 is the documented "unset" value and
        // is dropped silently; a negative number is a mistake and is warned about.
        if (typeof options.imgCount === "number" && options.imgCount === 0) {
            delete options.imgCount;
        } else if (typeof options.imgCount === "number" && options.imgCount < 0) {
            console.warn("RJLCustom404: Option 'imgCount' must be greater than 0. Using default.");
            delete options.imgCount;
        }

        // Validate imgStartIndex is non-negative when provided
        if (typeof options.imgStartIndex === "number" && options.imgStartIndex < 0) {
            console.warn("RJLCustom404: Option 'imgStartIndex' must be non-negative. Using default.");
            delete options.imgStartIndex;
        }

        // Validate imgPattern requires imgCount
        if (typeof options.imgPattern === "string" && options.imgPattern && !options.imgCount) {
            console.warn("RJLCustom404: Option 'imgPattern' requires 'imgCount' to be set.");
        }

        // Validate imgCount requires imgPattern
        if (typeof options.imgCount === "number" && options.imgCount > 0 && !options.imgPattern) {
            console.warn("RJLCustom404: Option 'imgCount' requires 'imgPattern' to be set.");
        }
    }

    // Resolve imgPattern + imgCount into imgFileNames array
    function resolveImageFileNames(options) {
        // imgFileNames array takes precedence
        if (Array.isArray(options.imgFileNames) && options.imgFileNames.length > 0) return;

        var pattern = getParam(options.imgPattern, defaults.imgPattern);
        var count = getParam(options.imgCount, defaults.imgCount);
        if (!pattern || !count) return;

        // Validate pattern has {n+} placeholder
        if (!/\{n+\}/.test(pattern)) {
            console.warn("RJLCustom404: imgPattern must contain {n} placeholder. No images will be generated.");
            return;
        }

        var startIndex = getParam(options.imgStartIndex, defaults.imgStartIndex);
        var generated = [];
        for (var i = 0; i < count; i++) {
            var num = startIndex + i;
            generated.push(pattern.replace(/\{(n+)\}/g, function(match, ns) {
                return String(num).padStart(ns.length, '0');
            }));
        }
        options.imgFileNames = generated;
    }

    // Resolve autoText: fill unset text fields with cycling random values
    function resolveAutoText(options) {
        if (!getParam(options.autoText, defaults.autoText)) return;

        // Restore text queues from localStorage
        var stored = loadState(getStorageKey('text'));
        if (stored) {
            if (Array.isArray(stored.titles)) shuffledPageTitles = stored.titles;
            if (Array.isArray(stored.headers)) shuffledHeaderTexts = stored.headers;
            if (Array.isArray(stored.subHeaders)) shuffledSubHeaderTexts = stored.subHeaders;
            if (Array.isArray(stored.btnTexts)) shuffledBtnDisplayTexts = stored.btnTexts;
        }

        if (typeof options.pageTitle === "undefined")
            options.pageTitle = pickRandom(shuffledPageTitles, AUTO_PAGE_TITLES);
        if (typeof options.headerText === "undefined")
            options.headerText = pickRandom(shuffledHeaderTexts, AUTO_HEADER_TEXTS);
        if (typeof options.subHeaderText === "undefined")
            options.subHeaderText = pickRandom(shuffledSubHeaderTexts, AUTO_SUB_HEADER_TEXTS);
        if (typeof options.btnDisplayText === "undefined") {
            var btnEntry = pickRandom(shuffledBtnDisplayTexts, AUTO_BTN_DISPLAY_TEXTS);
            options.btnDisplayText = btnEntry.text;
            options.btnDisplayHostName = btnEntry.withHost;
        }

        // Persist text queues
        saveState(getStorageKey('text'), {
            titles: shuffledPageTitles,
            headers: shuffledHeaderTexts,
            subHeaders: shuffledSubHeaderTexts,
            btnTexts: shuffledBtnDisplayTexts
        });
    }

    // Remove any existing custom404 content to prevent duplicates
    function removePreviousInstance() {
        var existingContainer = document.querySelector(".custom404-container");
        if (existingContainer) {
            existingContainer.remove();
        }
        var existingStyles = document.querySelectorAll("style[data-custom404]");
        existingStyles.forEach(function (s) { s.remove(); });
        if (_resizeHandler) {
            window.removeEventListener("resize", _resizeHandler);
            _resizeHandler = null;
        }
    }

    // Load script with custom options (if provided)
    window.RJLCustom404 = function (options) {
        if (typeof options === "undefined") { options = {}; }
        // Validate options before use
        validateOptions(options);
        // Resolve imgPattern + imgCount into imgFileNames
        resolveImageFileNames(options);
        // Resolve autoText: fill unset text fields with random values
        resolveAutoText(options);
        // Remove any previous instance before creating new one
        removePreviousInstance();
        // Store options globally for later use
        globalOptions = options;
        setPageTitle(options.pageTitle);
        applyBodyStyles(options);
        injectCSS(options);
        injectHTML(options);
    };

    window.RJLCustom404.refreshImage = function () {
        if (rjlImageElement) {
            // Set the new image source (no-op when the placeholder is showing)
            rjlImageElement.src = getRandomImage();
        }
    };

    window.RJLCustom404.version = LIB_VERSION;

})();
