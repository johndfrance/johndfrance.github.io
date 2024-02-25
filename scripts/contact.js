

function timedRedirect(){
    setTimeout(redirectURL, 2000)
    let result = document.getElementById("contactResult");
    result.innerHTML="<b> This page will redirect in 5 seconds</b>"

}

function redirectURL(){
    document.location.href = "./index.html";
}

function contactModal(name, email, subject, message){
    let form = document.getElementById("contactForm");

    if(form.checkValidity()) {
        let userName = document.getElementById("name").value;
        let userEmail = document.getElementById("email").value;
        let userSubject = document.getElementById("subject").value;
        let userMessage = document.getElementById("message").value;

        let modal = document.getElementById("modal");
        //let modalBody = document.getElementById("modal-body");

        modal.style.display = 'block';
        document.getElementById("modalUserName").innerHTML = "<b>Name:</b> " + userName;
        document.getElementById("modalUserEmail").innerHTML = "<b>Email:</b> " + userEmail;
        document.getElementById("modalUserSubject").innerHTML = "<b>Subject:</b> " + userSubject;
        document.getElementById("modalUserMessage").innerHTML = "<b>Message:</b> " + userMessage;

        //let data = document.createElement('p');

        // let displayMessage = `
        // Name: ${userName}
        // Email: ${userEmail}
        // Subject: ${userSubject}
        // Message: ${userMessage}
        // `;
    //     modal.style.display = 'block';
    //     .textContent = displayMessage;
    //     modalBody.appendChild(description);
    //     for (let element of form.elements){
    //         if(element.type !== "button"){
    //             element.value = "";
    //         }
    //     }
    // }else{
    //     alert("Form has empty fields.");
     }
}
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
        timedRedirect();
    }
};