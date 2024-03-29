"use strict";
(function () {
    function ActiveLinkCallback() {
        switch (router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "blog": return DisplayBlogPage;
            case "contact": return DisplayContactPage;
            case "events": return DisplayEventPage;
            case "gallery": return DisplayGalleryPage;
            case "login": return DisplayLoginPage;
            case "portfolio": return DisplayPortfolioPage;
            case "privacy": return DisplayPrivacyPage;
            case "registration": return DisplayRegPage;
            case "services": return DisplayServicesPage;
            case "team": return DisplayTeamPage;
            case "tos": return DisplayTOSPage;
            case "stats": return DisplayStatsPage;
            case "event-planning": return DisplayEventPlanning;
            case "404": return Display404Page;
            default:
                console.log("ERROR: callback function does not exist " + router.ActiveLink);
                return new Function();
        }
    }
    function changeLinkText() {
        console.log("changeLinkText function called");
        let blogLink = $('#blog');
        if (blogLink.length) {
            console.log("Element with id 'blog' found");
            blogLink.text('News');
        }
        else {
            console.log("Element with id 'blog' not found");
        }
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a id="logout" class="nav-link" data="home"><i class="fas fa-undo"></i> Logout</a>`);
            $("<li class='nav-item'>").append(`
            <a class="nav-link active p-2" data="stats">Stats</a>
        `).insertBefore("#logout");
            $("<li class='nav-item'>").append(`
            <a class="nav-link active p-2" data="event-planning">Event Planning</a>
        `).insertBefore("#logout");
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            LoadLink("home");
        });
    }
    function capitalizeFirstCharacter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function RegistrationFormValidation() {
        ValidateField("#firstName", /^[a-zA-Z]+(?:['\-][a-zA-Z]+)?$/, "Please Enter Valid Name");
        ValidateField("#lastName", /^[a-zA-Z]+(?:['\-][a-zA-Z]+)?$/, "Please Enter Valid Name");
        ValidateField("#password", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be 8 character, and contain one uppercase, one lowercase, one digit and one special character.");
        ValidateField("#confirmPassword", (input) => input === $("#password").val(), "Password and Confirm Password do not match");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please Enter a valid email");
    }
    function ValidateField(input_field_id, validation, error_mess) {
        const messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            const input_text = $(this).val();
            if (typeof validation === "function") {
                if (!validation(input_text)) {
                    $(this).trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text(error_mess).show();
                }
                else {
                    messageArea.removeClass("class").hide();
                }
            }
            else {
                const regex = validation;
                if (!regex.test(input_text)) {
                    $(this).trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text(error_mess).show();
                }
                else {
                    messageArea.removeClass("class").hide();
                }
            }
        });
    }
    function SearchFunctionality() {
        $("#searchButton").on("click", function () {
            const searchTerm = $("#searchInput").val();
            console.log("Search term:", searchTerm);
        });
    }
    function LoadHeader() {
        $.get("./views/components/header.html", function (html_data) {
            $("header").html(html_data);
            document.title = capitalizeFirstCharacter(router.ActiveLink);
            $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
            AddNavigationEvents();
            changeLinkText();
            CheckLogin();
        });
    }
    function LoadContent() {
        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallback();
        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
    }
    function LoadFooter() {
        $.get("./views/components/footer.html", function (html_data) {
            $("footer").html(html_data);
        });
    }
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = capitalizeFirstCharacter(router.ActiveLink);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li>a:contains([${document.title}])`).addClass("active");
        LoadContent();
    }
    function AuthGuard() {
        let protected_list = ["contact-list", "stats", "event-planning"];
        if (protected_list.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
            }
        }
    }
    function AddNavigationEvents() {
        let navlinks = $("ul>li>a");
        navlinks.off("click");
        navlinks.off("mouseover");
        navlinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        navlinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function AjaxRequest(method, url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (typeof callback == "function") {
                    callback(xhr.responseText);
                }
                else {
                    console.error("Error: callback not a function");
                }
            }
        });
        xhr.send();
    }
    function AddUser(firstName, lastName, username, emailAddress, password) {
        let user = new core.User(firstName, lastName, username, emailAddress, password);
        if (user.serialize()) {
            let key = user.username.substring(0, 1) + Date.now();
            localStorage.setItem(key, user.serialize());
        }
    }
    function DisplayRegPage() {
        console.log("Called DisplayRegPage");
        RegistrationFormValidation();
        let sentButton = document.getElementById("sendButton");
        sentButton.addEventListener("click", function (event) {
            event.preventDefault();
            let firstNameInput = document.getElementById("firstName");
            let lastNameInput = document.getElementById("lastName");
            let usernameInput = document.getElementById("username");
            let emailAddressInput = document.getElementById("emailAddress");
            let passwordInput = document.getElementById("password");
            if (firstNameInput && lastNameInput && usernameInput && emailAddressInput && passwordInput) {
                AddUser(firstNameInput.value, lastNameInput.value, usernameInput.value, emailAddressInput.value, passwordInput.value);
                location.href = "index.html";
            }
        });
    }
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage...");
        let messageArea = $("messageArea");
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            if (event) {
                event.preventDefault();
            }
            $.get("./data/users.json", function (data) {
                let messageArea = $("messageArea");
                let success = false;
                for (const user of data.users) {
                    console.log(user);
                    let username = document.getElementById("username");
                    let password = document.getElementById("password");
                    if (username.value === user.Username && password.value === user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("login");
                }
                else {
                    console.log("Failed to log in");
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();
                }
            });
        });
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage...");
        let serializedUser = sessionStorage.getItem("user");
        if (serializedUser) {
            let user = new core.User();
            user.deserialize(serializedUser);
            $("#greetingMessage").text("Welcome, " + user.displayName + "!");
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
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
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
        setTimeout(function () { showSlides(slideIndex); }, 3000);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }
    function DisplayBlogPage() {
        console.log("Called DisplayBlogPage...");
        AjaxRequest("GET", "./data/blogposts.json", LoadBlogs);
    }
    function LoadBlogs(data) {
        console.log("LoadBlogs called");
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
    function LoadEvents(data) {
        let parsed = JSON.parse(data);
        let eventGrid = $("#event-grid");
        $.each(parsed, function (index, eventData) {
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
    function DisplayEventPage() {
        console.log("Called DisplayEventPage");
        AjaxRequest("GET", "./data/events.json", LoadEvents);
    }
    function DisplayContactPage() {
        console.log("Called DisplayContactPage...");
        function initMap() {
            const harmonyHubLocation = { lat: 43.94524566723868, lng: -78.89483608988557 };
            const temp = document.getElementById("map");
            const map = new google.maps.Map(temp, {
                zoom: 15,
                center: harmonyHubLocation,
            });
            const marker = new google.maps.Marker({
                position: harmonyHubLocation,
                map: map,
            });
            google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
                let clicks = 0;
                document.getElementById("map")?.addEventListener("click", function () {
                    clicks++;
                    if (clicks === 3) {
                        const mapElement = document.getElementById("map");
                        if (mapElement) {
                            mapElement.style.width = "40%";
                            mapElement.style.height = "53%";
                        }
                        clicks = 0;
                    }
                });
                window.addEventListener('resize', () => {
                    google.maps.event.trigger(map, 'resize');
                });
            });
        }
        initMap();
        document.addEventListener("DOMContentLoaded", function () {
            document.getElementById("contactForm")?.addEventListener("submit", function (event) {
                console.log("FORM SUBMITTED");
                event.preventDefault();
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const subject = document.getElementById("subject").value;
                const message = document.getElementById("message").value;
                const reason = document.getElementById("reason").value;
                const userFeedback = document.getElementById("userFeedback");
                if (userFeedback) {
                    userFeedback.innerHTML = "<strong>Name:</strong> " + name + "<br>" +
                        "<strong>Email:</strong> " + email + "<br>" +
                        "<strong>Subject:</strong> " + subject + "<br>" +
                        "<strong>Reason:</strong> " + reason + "<br>" +
                        "<strong>Message:</strong> " + message;
                }
                const modalElement = document.getElementById('reg-modal');
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                }
                setTimeout(function () {
                    LoadLink("home");
                }, 5000);
            });
        });
    }
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage...");
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
            if (projectsContainer) {
                projectsContainer.appendChild(card);
            }
        }
        function loadProjects() {
            for (let i = 0; i < projectsPerPage; i++) {
                if (currentIndex < projects.length) {
                    createProjectCard(projects[currentIndex]);
                    currentIndex++;
                }
                else {
                    if (loadMoreBtn) {
                        loadMoreBtn.style.display = 'none';
                    }
                    break;
                }
            }
        }
        loadProjects();
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadProjects);
        }
    }
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage...");
    }
    function DisplayPrivacyPage() {
        console.log("Called DisplayPrivacyPage...");
    }
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage...");
        let acc = document.getElementsByClassName("accordion");
        let i;
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");
                let panel = this.nextElementSibling;
                if (panel?.style.maxHeight) {
                    panel.style.maxHeight = null;
                }
                else {
                    if (panel)
                        panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
    }
    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage...");
    }
    function DisplayTOSPage() {
        console.log("Called DisplayTOSPage...");
    }
    function Display404Page() {
        console.log("Called Display404Page");
    }
    function DisplayStatsPage() {
        console.log("Called DisplayStatsPage");
    }
    function DisplayEventPlanning() {
        console.log("Called DisplayGalleryPage");
        $(document).ready(function () {
            function savePost(title, content) {
                const postId = new Date().getTime().toString();
                const post = { id: postId, title: title, content: content, comments: [] };
                localStorage.setItem(`post_${postId}`, JSON.stringify(post));
                return postId;
            }
            function displayPosts() {
                const postContainer = $('#postContainer');
                postContainer.empty();
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        if (key.startsWith('post_')) {
                            const post = JSON.parse(localStorage.getItem(key));
                            const postElement = $('<div>').addClass('post');
                            postElement.html(`<h3>${post.title}</h3><p>${post.content}</p>`);
                            if (post.comments.length > 0) {
                                const commentList = $('<ul>');
                                commentList.html(post.comments.map((comment) => `<li class="comment">${comment}</li>`).join(''));
                                postElement.append(commentList);
                            }
                            const commentForm = $('<form>');
                            commentForm.html(`<label for="commentText_${post.id}">Leave a comment:</label><br>
                                          <input type="text" id="commentText_${post.id}" name="commentText" required><br>
                                          <button type="submit">Submit Comment</button>`);
                            commentForm.on('submit', function (event) {
                                event.preventDefault();
                                const commentText = $(this).find('input[name="commentText"]').val();
                                post.comments.push(commentText);
                                localStorage.setItem(`post_${post.id}`, JSON.stringify(post));
                                displayPosts();
                            });
                            postElement.append(commentForm);
                            postContainer.append(postElement);
                        }
                    }
                }
            }
            $('#postForm').on('submit', function (event) {
                event.preventDefault();
                const postTitle = $('#postTitle').val();
                const postContent = $('#postContent').val();
                savePost(postTitle, postContent);
                $(this).trigger('reset');
                displayPosts();
            });
            displayPosts();
        });
    }
    function Start() {
        console.log("App Started...");
        LoadHeader();
        LoadContent();
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
var slideIndex = 1;
showSlides(slideIndex);
function openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
        modal.style.display = "block";
    }
}
function closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
        modal.style.display = "none";
    }
}
function plusSlides(n) {
    showSlides(slideIndex += n);
}
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const captionText = document.getElementById("caption");
    const slideNumber = document.getElementsByClassName("slide-number")[0];
    if (n > slides.length) {
        n = 1;
    }
    if (n < 1) {
        n = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[n - 1].style.display = "block";
    slideNumber.innerHTML = n + " / " + slides.length;
}
var modalOverlay = document.getElementById("myModal");
modalOverlay?.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
});
//# sourceMappingURL=app.js.map