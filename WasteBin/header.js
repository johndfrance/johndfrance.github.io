// header.js

document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById("header-container");

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Specify the type of request and the URL
    xhr.open("GET", "header.html", true);

    // Set up a callback function to handle the response
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Insert the received HTML into the header container
            headerContainer.innerHTML = xhr.responseText;
        } else {
            console.error("Failed to load the header.");
        }
    };

    // Send the request
    xhr.send();
});
