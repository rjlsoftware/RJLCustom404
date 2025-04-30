(function () {

    //Domain and Path automatic images are coming from
    const AUTO_IMAGES_DOMAIN_PATH = "https://rjl.codes/error/404/images/";
    // Maximum number of default images in ^^^ folder
    const MAX_404_IMAGES = 123;

    // Dynamically generate the default image array
    const defaultImageArray = Array.from({ length: MAX_404_IMAGES }, (_, i) =>
         `${AUTO_IMAGES_DOMAIN_PATH}${i + 1}.webp`
    );

    // A working copy of defaultImageArray that will be shuffled and used
    let shuffledImageArray = [...defaultImageArray];
    // A working copy of user-defined images (shuffled)
    let shuffledUserImages = [];

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

    // Function to get a unique random image from user-defined list
    function getUniqueUserImage() {
        if (shuffledUserImages.length === 0) {
            // If all user images have been used, reset and shuffle
            shuffledUserImages = [...getParam(globalOptions.imgFileNames, defaults.imgFileNames)];
            shuffleArray(shuffledUserImages);
        }
        return shuffledUserImages.pop(); // Remove and return the last image
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
        imgBoxShadowColor: "rgba(18, 0, 100, .4)", // Default shadow color
        bodyBackgroundColor: "white", // New: Default body background color
        bodyFontColor: "black", // Default body font color
        maxImgWidth: "1000px", // Maximum image width
        imgResponsiveBreakpoints: true // Enable responsive breakpoints
    };

    // Function to get parameter or fallback to default
    function getParam(param, fallback) {
        return typeof param !== "undefined" ? param : fallback;
    }

    //Global variables to store options and image element
    let globalOptions = {}; // Store options for later use
    let rjlImageElement = null; // Store the image element

    // Function to select an image, ensuring uniqueness if using automatic404Image
    function getRandomImage() {
        if (getParam(globalOptions.automatic404Image, defaults.automatic404Image)) {
            return getUniqueRandomImage(); // Unique image from default 404 images
        } else {
            return getUniqueUserImage(); // Unique image from user-defined list
        }
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

            ${getParam(options.imgBoxShadow, defaults.imgBoxShadow) ? `
            .custom404-img:hover {
                box-shadow: 0 0 25px ${getParam(options.imgBoxShadowSize, defaults.imgBoxShadowSize)} ${getParam(options.imgBoxShadowColor, defaults.imgBoxShadowColor)};
                transform: scale(1.08);
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

        if (getParam(options.actionIsBtn, defaults.actionIsBtn)) {
            // Create a <button>
            const button = document.createElement("button");
            button.innerText = buttonText;
            button.title = `Go to ${window.location.hostname}`;
            button.onclick = () => window.location.href = "/";
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
        // Create main container
        const container = document.createElement("div");
        container.className = "custom404-container";

        // Set display flex direction based on header position
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
        textContainer.className = "custom404-text-container";
        textContainer.style.display = "flex";
        textContainer.style.flexDirection = "column";
        textContainer.style.alignItems = "center";
        textContainer.style.justifyContent = "flex-start";

        // Inject header
        const header = document.createElement("h3");
        header.className = "custom404-header";
        header.innerText = getParam(options.headerText, defaults.headerText);
        textContainer.appendChild(header);

        // Inject sub-header if provided
        const subHeaderText = getParam(options.subHeaderText, defaults.subHeaderText);
        if (subHeaderText) {
            const subHeader = document.createElement("p");
            subHeader.className = "custom404-subheader";
            subHeader.innerText = subHeaderText;

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

        // Create image container
        const imgContainer = document.createElement("div");
        imgContainer.className = "custom404-img-container";

        // Inject image with dynamic border-radius
        const imgLink = document.createElement("a");
        imgLink.href = "/";
        imgLink.id = "goHomeLink";
        imgLink.title = `Go to ${window.location.hostname}`;
        imgLink.style.display = "block";
        imgLink.style.width = "100%";

        const imgSrc = getRandomImage();
        if (getParam(options.automatic404Image, defaults.automatic404Image)) {
            // Apply watermark only if automatic404Image=true
            addWatermarkToImage(imgSrc, "© rjl.codes", function (watermarkedImg) {
                imgLink.appendChild(watermarkedImg);
            });
        } else {
            // No watermark for custom images
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = "404 Error";
            img.className = "custom404-img";
            img.style.borderRadius = getParam(options.imgBorderRadius, defaults.imgBorderRadius);

            // Prevent dragging
            img.ondragstart = function () { return false; };
            img.style.webkitUserSelect = "none";
            img.style.mozUserSelect = "none";
            img.style.msUserSelect = "none";
            img.style.userSelect = "none";

            rjlImageElement = img;

            imgLink.appendChild(img);
        }

        imgContainer.appendChild(imgLink);

        // Append elements based on position
        if (options.headerTextPosition === "top") {
            container.appendChild(textContainer);
            container.appendChild(imgContainer);
        } else {
            container.appendChild(imgContainer);
            container.appendChild(textContainer);
        }

        // Append to body
        document.body.appendChild(container);

        // Add responsive handling for mobile
        if (getParam(options.imgResponsiveBreakpoints, defaults.imgResponsiveBreakpoints)) {
            window.addEventListener('resize', function() {
                handleResponsiveLayout(container, textContainer, imgContainer, options);
            });

            // Initial call to set correct layout
            handleResponsiveLayout(container, textContainer, imgContainer, options);
        }
    }

    // Function to handle responsive layout changes
    function handleResponsiveLayout(container, textContainer, imgContainer, options) {
        const windowWidth = window.innerWidth;

        // Force column layout on mobile regardless of headerTextPosition setting
        if (windowWidth <= 768 && options.headerTextPosition !== "top") {
            container.style.flexDirection = "column";
        } else if (options.headerTextPosition === "left") {
            container.style.flexDirection = "row-reverse";
        } else if (options.headerTextPosition === "right") {
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

            if (globalOptions.automatic404Image) {
                // Apply watermark AFTER the new image is fully loaded
                rjlImageElement.onload = function () {
                    applyWatermark(rjlImageElement, "© rjl.codes");
                };
            };
        }
    };

})();