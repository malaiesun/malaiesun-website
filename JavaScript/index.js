<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Featured Projects</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="featured-projects-container">
    <h1>Featured Projects</h1>
    <div id="featured-projects"></div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      const featuredProjectsContainer = document.getElementById('featured-projects');
      
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

      // Check if an image exists
      async function checkImageExists(imageUrl) {
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' });
          return response.ok;
        } catch (error) {
          return false;
        }
      }

      // Generate Project Cards for Featured Projects
      async function generateFeaturedProjects() {
        const projects = await fetchFeaturedProjects();

        if (!projects.length) {
          featuredProjectsContainer.innerHTML = '<p>No projects found.</p>';
          return;
        }

        for (const project of projects) {
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
          featuredProjectsContainer.appendChild(projectCard);
        }
      }

      generateFeaturedProjects();
    });

