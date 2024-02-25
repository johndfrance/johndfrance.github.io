function openModal(name, role, imageUrl, description) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalRole = document.getElementById('modal-role');
    const modalDescription = document.getElementById('modal-description');

    modal.style.display = 'block';
    modalImage.src = imageUrl;
    modalImage.alt = name;
    modalName.textContent = name;
    modalRole.textContent = role;
    modalDescription.textContent = description;
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Close modal if user clicks outside the modal content
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};
