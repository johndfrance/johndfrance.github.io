document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    changeLinkText();
});

function changeLinkText() {
    console.log("changeLinkText function called");
    let blogLink = document.getElementById('blog');

    if (blogLink) {
        console.log("Element with id 'blog' found");
        blogLink.textContent = 'News';
    } else {
        console.log("Element with id 'blog' not found");
    }
}
