(function(){

    function changeLinkText() {
        console.log("changeLinkText function called");
        let blogLink = $('#blog');

        if (blogLink.length) {
            console.log("Element with id 'blog' found");
            blogLink.text('News');
        } else {
            console.log("Element with id 'blog' not found");
        }
    }

    function CheckLogin(){
        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-undo"></i> Logout</a>`);
        }
        $("#logout").on("click", function(){
            sessionStorage.clear();
            location.href="index.html";
        });
    }

    function SearchFunctionality() {
        $("#searchButton").on("click", function() {
            const searchTerm = $("#searchInput").val().toLowerCase();
            // Perform search logic here
            console.log("Search term:", searchTerm);
            // For testing, just log the search term
        });
    }

    function LoadHeader(html_header){
        $("header").html(html_header);
        $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
        CheckLogin();
        changeLinkText();

        // Call SearchFunctionality on pages where search is required
        if (document.title === "Blog" || document.title === "Gallery" || document.title === "Events") {
            SearchFunctionality();
        }
    }

    function LoadFooter(html_footer){
        $("footer").html(html_footer);
    }

    function AjaxRequest(method, url, callback){
        let xhr = new XMLHttpRequest();
        xhr.open(method, url,true);
        xhr.addEventListener("readystatechange", ()=>{
            if(xhr.readyState === 4 && xhr.status === 200){
                if(typeof callback == "function"){
                    callback(xhr.responseText);
                }else{
                    console.error("Error: callback not a function");
                }
            }
        });
        xhr.send();
    }

    function Start(){
        console.log("App Started...");
        AjaxRequest("GET", "header.html", LoadHeader);
        AjaxRequest("GET", "footer.html", LoadFooter);
        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Blog":
                DisplayBlogPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
            case "Portfolio":
                DisplayPortfolioPage();
                break;
            case "Privacy":
                DisplayPrivacyPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Team":
                DisplayTeamPage();
                break;
            case "Terms of Service":
                DisplayTOSPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Registration":
                DisplayRegPage();
                break;
            case "Events":
                DisplayEventPage();
        }
    }
    window.addEventListener("load", Start);


    function AddUser(firstName, lastName, username, emailAddress, password){
        let user = new core.User(firstName, lastName, username, emailAddress, password);
        if(user.serialize()){
            let key = user.username.substring(0,1) + Date.now();
            localStorage.setItem(key, user.serialize());
        }
    }
    function DisplayRegPage(){
        console.log("Called DisplayRegPage");
        RegistrationFormValidation();
        let sentButton = document.getElementById("sendButton");
        sentButton.addEventListener("click", function (){
            event.preventDefault();
            AddUser(firstName.value, lastName.value, username.value, emailAddress.value, password.value);
            location.href = "index.html";
        });
    }
    function DisplayLoginPage(){
        console.log("Called DisplayLoginPage...");
        let messageArea = $("messageArea");
        $("#loginButton").on("click", function(){
            let success = false;
            let newUser = new core.User();

            $.get("./data/users.json", function(data){
                for(const user of data.users){
                    console.log(user);
                    if(username.value === user.Username && password.value === user.Password){
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if(success){
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href = "index.html";

                }else{
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();
                }
            });
        });/*
        $("#cancelButton").on("click", function (){
            document.forms[0].reset();
            location.href = "index.html";
        });
        */
    }



    function DisplayHomePage(){
        console.log("Called DisplayHomePage...");

        let serializedUser = sessionStorage.getItem("user");
        if (serializedUser) {
            let user = new core.User();
            user.deserialize(serializedUser);

            // Display greeting message with user's name
            $("#greetingMessage").text("Welcome, " + user.displayName+ "!");
        }
        let slideIndex = 0;
        showSlides(slideIndex);
    }
    let slideIndex = 0;

    function showSlides(slideIndex) {
        let i;
        const slides = document.getElementsByClassName("slide-home");
        const dots = document.getElementsByClassName("dot");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
            (function (index) {
                dots[i].addEventListener("click", function () {
                    currentSlide(index);
                });
            })(i);
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
        setTimeout(function() { showSlides(slideIndex); }, 3000);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }
    function DisplayBlogPage(){
        console.log("Called DisplayBlogPage...");


        AjaxRequest("GET", "./data/blogposts.json", LoadBlogs);

    }

    function LoadBlogs(data) {
        let parsed = JSON.parse(data);
        let postGrid = $("#preview-articles");
        let row = $('<div class="row">');

        $.each(parsed, function (index, postData) {
            let blogPost = new core.BlogPost();
            blogPost.fromJSON(postData);
            let $newPost = $('<div class="col-md-4">');

            $newPost.html(`
            <article class="mb-4 m-1 p-1">
                <img src="${blogPost.imageUrl}" alt="${blogPost.title}">
                <h2 class="m-1 p-1">${blogPost.title}</h2>
                <p class="m-1 p-1">${blogPost.preview}</p>
                <a href="#" class="btn btn-primary m-1 p-1">Read More</a>
            </article>
        `);
            row.append($newPost);
            if ((index + 1) % 3 === 0) {
                postGrid.append(row);
                row = $('<div class="row">');
            }
        });
        if (parsed.length % 3 !== 0) {
            postGrid.append(row);
        }
    }

    function LoadEvents(data){
        let parsed = JSON.parse(data);
        let eventGrid = $("#event-grid");
        $.each(parsed, function(index, eventData){
           let eventPost = new core.Event();
           eventPost.fromJSON(eventData);
           let $newPost = $('<div>');
           $newPost.addClass('container');
           $newPost.html(`<div class="container border rounded m-3 p-2">
<img src="${eventPost.imageUrl}" alt="${eventPost.title}">
                        <h2>${eventPost.title}</h2>
                        <h5>${eventPost.date} @ ${eventPost.location}</h5>
                        <p>${eventPost.description}</p>
</div>`);
           eventGrid.append($newPost);
        });
    }

    function DisplayEventPage(){
        console.log("Called DisplayEventPage");
        AjaxRequest("GET", "./data/events.json", LoadEvents);
    }


    function DisplayContactPage(){
        console.log("Called DisplayContactPage...");
        document.addEventListener("click", function() {
            // Add event listener to form submission
            document.getElementById("contactForm").addEventListener("submit", function(event) {
                console.log("FORM SUBMITTED");
                event.preventDefault(); // Prevent form submission
                // Get form data
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const subject = document.getElementById("subject").value;
                const message = document.getElementById("message").value;
                const reason = document.getElementById("reason").value; // New dropdown menu value

                // Update modal content with user feedback
                const userFeedback = document.getElementById("userFeedback");
                userFeedback.innerHTML = "<strong>Name:</strong> " + name + "<br>" +
                    "<strong>Email:</strong> " + email + "<br>" +
                    "<strong>Subject:</strong> " + subject + "<br>" +
                    "<strong>Reason:</strong> " + reason  + "<br>" +
                    "<strong>Message:</strong> " + message;

                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById('reg-modal'));
                modal.show();

                // Redirect after 5 seconds
                setTimeout(function() {
                    window.location.href = "/index.html"; // Replace with your desired URL
                }, 5000); // 5000 milliseconds = 5 seconds
            });
        });


    }
    function DisplayPortfolioPage(){
        console.log("Called DisplayPortfolioPage...");
        loadProjects();
        loadMoreBtn.addEventListener('click', loadProjects);
    }
    const projects = [
        { title: 'Project 1', description: 'Description for Project 1', imageUrl: './images/proj.jpg' },
        { title: 'Project 2', description: 'Description for Project 2', imageUrl: './images/proj.jpg' },
        { title: 'Project 3', description: 'Description for Project 3', imageUrl: './images/proj.jpg' },
        { title: 'Project 4', description: 'Description for Project 4', imageUrl: './images/proj.jpg' },

    ];

    const projectsContainer = document.getElementById('projects-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    let projectsPerPage = 3;
    let currentIndex = 0;
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.classList.add('project-card');

        const title = document.createElement('h3');
        title.textContent = project.title;

        const description = document.createElement('p');
        description.textContent = project.description;

        const image = document.createElement('img');
        image.src = project.imageUrl;
        image.alt = project.title;

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(image);

        projectsContainer.appendChild(card);
    }
    function loadProjects() {
        for (let i = 0; i < projectsPerPage; i++) {
            if (currentIndex < projects.length) {
                createProjectCard(projects[currentIndex]);
                currentIndex++;
            } else {
                loadMoreBtn.style.display = 'none';
                break;
            }
        }
    }

    function DisplayPrivacyPage(){
        console.log("Called DisplayPrivacyPage...");
    }
    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage...");
    }
    function DisplayTeamPage(){
        console.log("Called DisplayTeamPage...");
    }
    function DisplayTOSPage(){
        console.log("Called DisplayTOSPage...");
    }

})();
var slideIndex = 1;
showSlides(slideIndex);

function openModal() {
    document.getElementById('myModal').style.display = "block";
}

function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var captionText = document.getElementById("caption");
    var slideNumber = document.getElementsByClassName("slide-number");

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
    slideNumber.innerHTML = slideIndex + " / " + slides.length; // Update image number
}


// Get the modal overlay
var modalOverlay = document.getElementById("myModal");

// Close the modal if the user clicks outside of the modal content
modalOverlay.addEventListener("click", function(event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

function initMap() {
    // Used Durham College address for Harmony Hub
    const harmonyHubLocation = { lat:43.94524566723868, lng: -78.89483608988557 };

    // The map, centered at your business location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: harmonyHubLocation,
    });

    // The marker, positioned at your business location
    const marker = new google.maps.Marker({
        position: harmonyHubLocation,
        map: map,
    });
    google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
        let clicks = 0;
        let timer = null;
        document.getElementById("map").addEventListener("click", function() {
             clicks++;
            if (clicks === 3) {
                // Reset the size of the map
                document.getElementById("map").style.width = "40%";
                document.getElementById("map").style.height = "53%";
                clicks = 0;
            }
        //     if (clicks === 1) {
        //         timer = setTimeout(function() {
        //             clicks = 0;
        //         }, 5); // Change the delay as needed for detecting a double click
        //     } else if (clicks === 3) {
        //         clearTimeout(timer);
        //         timer = null;
        //         clicks = 0;
        //         // Make the map draggable
        //         $("#map").draggable();
        //     }
         });
        // Make the map draggable using jQuery UI
        //$("#map").draggable();

        // Make the map resizable using jQuery UI
        $("#map").resizable({
            resize: function(event, ui) {
                // Trigger the Google Maps resize event when the container is resized
                google.maps.event.trigger(map, 'resize');
            }
        });
    });
}
