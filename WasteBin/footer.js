
document.addEventListener("DOMContentLoaded", function(){
    const footerContainer = document.getElementById("footer-container");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "footer.html", true);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            footerContainer.innerHTML = xhr.responseText;
        }else{
            console.error("Failed to load footer.")
        }
    };
    xhr.send();
});