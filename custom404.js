/*
EXAMPLE with all options:

<script>
    RJLCustom404({
        pageTitle: "File Not Found",   // Custom Page Title
        bodyBackgroundColor: "#fff",  // Default body background color
        bodyFontColor: "#000",        // Default font color

        imgBorderRadius: "10%",        // Custom border radius
        imgFileNames: ["/errors/404.webp", "/errors/404-2.webp", "/errors/404-3.webp"], // Custom images
        automatic404Image: false, // Automatically display one of our 404 images
        imgBoxShadow: false, // Enables or disables the shadow.
        imgBoxShadowSize: "5px", // Controls shadow size.
        imgBoxShadowColor: "rgba(101, 179, 230, 1)", //Custom shadow color.

        btnColor: "blue",           // Button color
        btnPulsate: true,           // Enable pulsation
        btnPulsateCount: 2,         // Pulsate x times
        btnDisplayText: "asdf",     // Text to display on the button
        btnDisplayHostName: false,  // Show the hostname after the displayText
        actionIsBtn: true,          // Is it a <btn> tag or simple plain text <a href>

        headerText: "I found something", // Custom header text
        headerTextPosition: "left",  // "top", "left", or "right"
        subHeaderText: "Problably not what you wanted..." // Sub header text
    });
</script>
*/

(function () {

    // Maximum number of default images
    const MAX_404_IMAGES = 123;

    // Dynamically generate the default image array
    const defaultImageArray = Array.from({ length: MAX_404_IMAGES }, (_, i) =>
         `https://rjl.codes/error/404/images/${i + 1}.webp`
    );

    // A working copy of defaultImageArray that will be shuffled and used
    let shuffledImageArray = [...defaultImageArray];

    // Function to shuffle an array (Fisher-Yates Algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Shuffle images at the start
    shuffleArray(shuffledImageArray);

    // Function to get a unique random image
    function getUniqueRandomImage() {
        if (shuffledImageArray.length === 0) {
            // If all images have been used, reset the array and shuffle again
            shuffledImageArray = [...defaultImageArray];
            shuffleArray(shuffledImageArray);
        }
        return shuffledImageArray.pop(); // Remove and return the last image in the shuffled array
    }

    //disable right-clicking on the entire page
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    //Disable right-click only on images
    document.querySelectorAll("img").forEach(img => {
      img.addEventListener("contextmenu", event => event.preventDefault());
    });

    // Default settings
    const defaults = {
        pageTitle: "404 - Not Found",
        imgBorderRadius: "50%",
        imgFileNames: ["/errors/404-1.webp", "/errors/404-2.webp", "/errors/404-3.webp"],
        btnColor: "blue",
        btnPulsate: true,
        btnPulsateCount: 2,
        headerText: "404 - File not found",
        subHeaderText: "",
        headerTextPosition: "top", // "top", "left", or "right"
        btnDisplayHostName: true, // Show hostname in button text
        btnDisplayText: "Back to", // Custom button text
        actionIsBtn: true, // Use <button> (true) or plain <a> text (false)
        imgBoxShadow: false, // Enable box shadow on hover
        imgBoxShadowSize: "5px", // Default shadow size
        imgBoxShadowColor: "rgba(255, 255, 255, 1)", // Default shadow color
        bodyBackgroundColor: "white", // New: Default body background color
        bodyFontColor: "black" // New: Default body font color
    };

    // Function to get parameter or fallback to default
    function getParam(param, fallback) {
        return typeof param !== "undefined" ? param : fallback;
    }

    //Global variables to store options and image element
    let globalOptions = {}; // Store options for later use
    let rjlImageElement = null; // Store the image element

    // Function to select a random image from the appropriate array
    function getRandomImage() {
        if (getParam(globalOptions.automatic404Image, defaults.automatic404Image)) {
            // Use default image array when automatic404Image is true
            //return defaultImageArray[Math.floor(Math.random() * defaultImageArray.length)];
            return getUniqueRandomImage(); // Unique image from shuffled list
        }
        // Otherwise, use user-provided images
        const userImages = getParam(globalOptions.imgFileNames, defaults.imgFileNames);
        return userImages[Math.floor(Math.random() * userImages.length)];
    }

    // Function to set page title
    function setPageTitle(title) {
        document.title = getParam(title, defaults.pageTitle);
    }

    // Function to apply body styles (background and font color)
    function applyBodyStyles(options) {
        document.body.style.backgroundColor = getParam(options.bodyBackgroundColor, defaults.bodyBackgroundColor);
        document.body.style.color = getParam(options.bodyFontColor, defaults.bodyFontColor);
    }

    // Function to inject CSS (for hover effects)
    function injectCSS(options) {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes pulsate {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .custom404-img {
                transform: scale(1.05);
                transition: box-shadow 0.3s ease, transform 0.3s ease;
            }

            ${getParam(options.imgBoxShadow, defaults.imgBoxShadow) ? `
            .custom404-img:hover {
                box-shadow: 0 ${getParam(options.imgBoxShadowSize, defaults.imgBoxShadowSize)}
                            25px 8px ${getParam(options.imgBoxShadowColor, defaults.imgBoxShadowColor)};
                transform: scale(1.08);
            }` : ""}
        `;
        document.head.appendChild(style);
    }

    // Function to create action element (button or plain text link)
    function createActionElement(options) {
        const displayText = getParam(options.btnDisplayText, defaults.btnDisplayText);
        const includeHost = getParam(options.btnDisplayHostName, defaults.btnDisplayHostName);
        const buttonText = includeHost ? `${displayText} ${window.location.hostname}` : displayText;

        if (getParam(options.actionIsBtn, defaults.actionIsBtn)) {
            // Create a <button>
            const button = document.createElement("button");
            button.innerText = buttonText;
            button.title = `Go to ${window.location.hostname}`;
            button.onclick = () => window.location.href = "/";
            button.style.backgroundColor = getParam(options.btnColor, defaults.btnColor);
            button.style.color = "white";
            button.style.padding = "15px 30px";
            button.style.fontSize = "1.2em";
            button.style.border = "none";
            button.style.cursor = "pointer";
            button.style.marginTop = "5px";
            button.style.borderRadius = "10px";

            // Apply pulsating effect if enabled
            if (getParam(options.btnPulsate, defaults.btnPulsate)) {
                const pulsateCount = getParam(options.btnPulsateCount, defaults.btnPulsateCount);
                button.style.animation = pulsateCount === 0 ? "none" : `pulsate 2s ease-in-out ${pulsateCount} forwards`;
            }
            return button;
        } else {
            // Create a plain text <a> link (no button styling)
            const link = document.createElement("a");
            link.href = "/";
            link.innerText = buttonText;
            link.title = `Go to ${window.location.hostname}`;
            link.style.color = "inherit"; // Matches surrounding text
            link.style.textDecoration = "underline"; // Keep it looking like a normal link
            link.style.fontSize = "1.2em";
            return link;
        }
    }

    // Helper method for canvas work
    function generateWatermarkedImage(img, watermarkText) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions equal to the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Apply watermark text
        ctx.font = "20px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; // White with transparency
        // ctx.textAlign = "right";
        // ctx.fillText(watermarkText, canvas.width - 100, canvas.height - 15);

ctx.textAlign = "center"; // Center horizontally
    ctx.textBaseline = "bottom"; // Align text from the bottom

    // Calculate position: center horizontally, 15px from the bottom
    const centerX = canvas.width / 2;
    const bottomY = canvas.height - 5; // 15 pixels from the bottom

    // Draw the text
    ctx.fillText(watermarkText, centerX, bottomY);

        // Return the watermarked image as a data URL
        return canvas.toDataURL("image/png");
    }

    // used on RefreshImage()
    function applyWatermark(imgElement, watermarkText) {
        const img = new Image();
        img.src = imgElement.src; // Load the new image
        img.crossOrigin = "anonymous"; // Prevent CORS issues for external images

        img.onload = function () {
            // Generate the watermarked image
            const watermarkedSrc = generateWatermarkedImage(img, watermarkText);

            // Replace the image's src only once
            imgElement.onload = null; // Ensure no infinite loop
            imgElement.src = watermarkedSrc;
        };
    }


    // used in outputting img code
    function addWatermarkToImage(imgSrc, watermarkText, callback) {
        const img = new Image();
        img.src = imgSrc;
        img.crossOrigin = "anonymous"; // Prevents CORS issues if loading external images

        img.onload = function () {
            // Generate the watermarked image
            const watermarkedSrc = generateWatermarkedImage(img, watermarkText);

            // Create a new image element with the watermarked canvas
            const watermarkedImg = document.createElement("img");
            watermarkedImg.src = watermarkedSrc;
            watermarkedImg.alt = "404 Error";
            watermarkedImg.className = "custom404-img";
            watermarkedImg.style.maxWidth = "100%";
            watermarkedImg.style.height = "auto";
            watermarkedImg.style.margin = "35px 35px 0px 35px";
            watermarkedImg.style.display = "block";
            watermarkedImg.style.borderRadius = getParam(globalOptions.imgBorderRadius, defaults.imgBorderRadius);

            // Prevent dragging
            watermarkedImg.ondragstart = function () { return false; };
            watermarkedImg.style.webkitUserSelect = "none";
            watermarkedImg.style.mozUserSelect = "none";
            watermarkedImg.style.msUserSelect = "none";
            watermarkedImg.style.userSelect = "none";

            // Store reference for refresh functionality
            rjlImageElement = watermarkedImg;

            // Call the callback function with the generated image
            if (typeof callback === "function") {
                callback(watermarkedImg);
            }
        };
    }


    // Function to inject HTML
    function injectHTML(options) {
        const container = document.createElement("div");
        container.style.textAlign = "center";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.display = "flex";
        container.style.flexDirection = options.headerTextPosition === "top" ? "column" : "row";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.gap = "20px";

        if (options.headerTextPosition === "left") {
            container.style.flexDirection = "row-reverse"; // Reverse for left alignment
        }

        // Create a wrapper for text elements
        const textContainer = document.createElement("div");
        textContainer.style.display = "flex";
        textContainer.style.flexDirection = "column";
        textContainer.style.alignItems = "center";
        textContainer.style.justifyContent = "flex-start";

        // Inject header
        const header = document.createElement("h3");
        header.innerText = getParam(options.headerText, defaults.headerText);
        header.style.fontSize = "2em";
        header.style.margin = "10px 0";
        textContainer.appendChild(header);

        // Inject sub-header if provided
        const subHeaderText = getParam(options.subHeaderText, defaults.subHeaderText);
        if (subHeaderText) {
            const subHeader = document.createElement("p");
            subHeader.innerText = subHeaderText;
            subHeader.style.fontSize = "1.2em";
            subHeader.style.margin = "5px 0";
            // Fetch the body font color correctly using getParam()
            const bodyFontColor = getParam(options.bodyFontColor, defaults.bodyFontColor);
            // If font color is black or dark, make subheader text a little lighter
            if (bodyFontColor === "black" || bodyFontColor === "#000" || bodyFontColor === "rgb(0, 0, 0)") {
                subHeader.style.color = "#666";
            } else {
                subHeader.style.color = bodyFontColor; // Otherwise, use the specified color
            }
            textContainer.appendChild(subHeader);
        }

        // Inject action (button or plain text link)
        textContainer.appendChild(createActionElement(options));

        // Inject image with dynamic border-radius
        const imgLink = document.createElement("a");
        imgLink.href = "/";
        imgLink.id = "goHomeLink";
        imgLink.title = `Go to ${window.location.hostname}`;

        //imgLink.appendChild(addWatermarkToImage(getRandomImage(), "© rjl.codes"));
        // Fetch and add the image asynchronously
        addWatermarkToImage(getRandomImage(), "© rjl.codes", function (watermarkedImg) {
            imgLink.appendChild(watermarkedImg);
        });

        // Append elements based on position
        if (options.headerTextPosition === "top") {
            container.appendChild(textContainer);
            container.appendChild(imgLink);
        } else {
            container.appendChild(imgLink);
            container.appendChild(textContainer);
        }

        // Append to body
        document.body.appendChild(container);
    }

    // Load script with custom options (if provided)
    window.RJLCustom404 = function (options = {}) {
        // Store options globally for later use
        globalOptions = options;
        setPageTitle(options.pageTitle);
        applyBodyStyles(options);
        injectCSS(options);
        injectHTML(options);
    };

    window.RJLCustom404.refreshImage = function () {
        if (rjlImageElement) {
            const newSrc = getRandomImage();

            // Remove previous onload event to prevent multiple calls
            rjlImageElement.onload = null;

            // Set the new image source
            rjlImageElement.src = newSrc;

            // Apply watermark AFTER the new image is fully loaded
            rjlImageElement.onload = function () {
                applyWatermark(rjlImageElement, "© rjl.codes");
            };
        }
    };



})();
