document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const toggleLink = document.getElementById('toggleLink');
  const featuredSection = document.getElementById('featured');
  const archiveSection = document.getElementById('archive');
  const searchBox = document.getElementById('searchBox');
  const featuredProjectsContainer = document.getElementById('featured-projects-container');
  const noResultsMessage = document.querySelector('.no-results-found');
  const featuredProjects = document.querySelector('.featured-projects');

  // Toggle Link Logic
  const toggleLinkHandler = () => {
    if (toggleLink.textContent === 'Archive') {
      toggleLink.setAttribute('href', '#archive');
      toggleLink.textContent = 'Featured';
    } else {
      toggleLink.setAttribute('href', '#featured');
      toggleLink.textContent = 'Archive';
    }
  };

  toggleLink.addEventListener('click', toggleLinkHandler);

  // Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === featuredSection && entry.isIntersecting) {
        toggleLink.setAttribute('href', '#archive');
        toggleLink.textContent = 'Archive';
      } else if (entry.target === archiveSection && entry.isIntersecting) {
        toggleLink.setAttribute('href', '#featured');
        toggleLink.textContent = 'Featured';
      }
    });
  }, observerOptions);

  observer.observe(featuredSection);
  observer.observe(archiveSection);

  // Check if an image exists
  async function checkImageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Helper function to parse and compare dates
  const parseDate = dateStr => new Date(dateStr);

  const sortByDate = projects => {
    return projects.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  };

  // Fetch Featured Projects Data
  async function fetchFeaturedProjects() {
    try {
      const response = await fetch('projects.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
  }

  // Fetch Archive Projects Data
  async function fetchArchiveProjects() {
    try {
      const response = await fetch('archprojects.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching archive projects:', error);
      return [];
    }
  }

  // Generate Project Cards for Featured Projects
  async function generateFeaturedProjects() {
    const projects = await fetchFeaturedProjects();

    if (!projects.length) {
      featuredProjects.innerHTML = '<p>No projects found.</p>';
      return;
    }

    // Sort projects by date (latest first)
    const sortedProjects = sortByDate(projects);

    for (const project of sortedProjects) {
      // Fallback for empty or missing title
      project.title = project.title.trim() ? project.title : "Unavailable";

      // Check if the thumbnail image exists, if not set fallback image
      const imageExists = await checkImageExists(project.thumbnail);
      if (!imageExists) {
        project.thumbnail = "Pictures/Project Thumbnails/Unavailable.jpg";
      }

      const projectCard = document.createElement('div');
      projectCard.classList.add('featured-card');

      const projectLink = document.createElement('a');
      projectLink.href = project.link;
      projectLink.innerHTML = `
        <div class="featured-card-imgholder">
          <img src="${project.thumbnail}" alt="${project.title}">
        </div>
        <div class="featured-card-content">
          <h2>${project.title}</h2>
          <p class="featured-description">${project.description}</p>
        </div>
      `;

      projectCard.appendChild(projectLink);
      featuredProjects.appendChild(projectCard);
    }
  }

  // Generate Project Cards for Archive Projects
  async function generateArchiveProjects() {
    const projects = await fetchArchiveProjects();

    if (!projects.length) {
      archiveSection.innerHTML = '<p>No archive projects found.</p>';
      return;
    }

    // Sort projects by date (latest first)
    const sortedProjects = sortByDate(projects);

    sortedProjects.forEach(project => {
      // Fallback for empty or missing title
      project.title = project.title.trim() ? project.title : "Unavailable";

      const projectCard = document.createElement('div');
      projectCard.classList.add('archive-card');

      const projectLink = document.createElement('a');
      projectLink.href = project.link;

      projectLink.innerHTML = `
        <div class="archive-card-imgholder">
          <img src="${project.thumbnail}" alt="${project.title}">
        </div>
        <div class="archive-card-content">
          <h2>${project.title}</h2>
          <p class="archive-description">${project.description}</p>
        </div>
      `;

      projectCard.appendChild(projectLink);
      archiveSection.appendChild(projectCard);
    });
  }

  // Call generateFeaturedProjects and generateArchiveProjects
  generateFeaturedProjects();
  generateArchiveProjects();

  // Search Filtering
  const filterCards = searchTerm => {
    const featuredCards = document.querySelectorAll('.featured-card');
    let noResults = true;

    featuredCards.forEach(card => {
      const heading = card.querySelector('h2').textContent.toLowerCase().replace(/\s+/g, '');
      if (heading.includes(searchTerm)) {
        card.classList.remove('not-searched');
        noResults = false;
      } else {
        card.classList.add('not-searched');
      }
    });

    if (noResults) {
      noResultsMessage.classList.add('no-results-found-show');
      featuredProjectsContainer.classList.add('not-searched-container');
    } else {
      noResultsMessage.classList.remove('no-results-found-show');
      featuredProjectsContainer.classList.remove('not-searched-container');
    }
  };

  searchBox.addEventListener('input', () => {
    const searchTerm = searchBox.value.trim().toLowerCase().replace(/\s+/g, '');
    filterCards(searchTerm);
  });

  searchBox.addEventListener('blur', () => {
    if (searchBox.value === '') {
      const featuredCards = document.querySelectorAll('.featured-card');
      featuredCards.forEach(card => card.classList.remove('not-searched'));
      noResultsMessage.classList.remove('no-results-found-show');
    }
  });

  // Horizontal Scroll for Featured Projects
  featuredProjects.addEventListener('wheel', event => {
    event.preventDefault();
    event.currentTarget.scrollLeft += event.deltaY;
  });
});
