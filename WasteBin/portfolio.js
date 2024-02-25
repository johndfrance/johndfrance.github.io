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

loadMoreBtn.addEventListener('click', loadProjects);

// Initial load

