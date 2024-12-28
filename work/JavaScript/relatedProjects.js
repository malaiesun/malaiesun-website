document.addEventListener("DOMContentLoaded", () => {
    // Get the current project title from the header
    const projectTitle = document.querySelector(".header-container .header h1").innerText.trim();
  
    // Container for related projects
    const relatedProjectsContainer = document.querySelector(".related-projects");
  
    // Fallback image for missing thumbnails
    const fallbackThumbnail = "../Pictures/Project Thumbnails/Unavailable.jpg";
  
    // Function to check if an image exists
    async function checkImageExists(imageUrl) {
      try {
        const response = await fetch(imageUrl, { method: "HEAD" });
        return response.ok;
      } catch (error) {
        console.error("Error checking image:", error);
        return false;
      }
    }
  
    // Fetch the projects.json file
    fetch("/projects.json")
      .then(response => response.json())
      .then(async projects => {
        // Find the current project in the JSON
        const currentProject = projects.find(project => project.title === projectTitle);
  
        if (!currentProject) {
          console.error("Current project not found in JSON.");
          relatedProjectsContainer.innerHTML = "<p>Unable to load related projects.</p>";
          return;
        }
  
        // Extract current project's tags (case-insensitive, split by commas)
        const currentTags = currentProject.tags
          .split(",")
          .map(tag => tag.trim().toLowerCase()); // Convert tags to lowercase for comparison
  
        // Find related projects based on matching tags
        const relatedProjects = projects.filter(project =>
          project.title !== currentProject.title && // Exclude the current project
          project.tags
            .split(",")
            .map(tag => tag.trim().toLowerCase()) // Convert tags to lowercase
            .some(tag => currentTags.includes(tag)) // Check for tag overlap
        );
  
        // Sort related projects by date (latest first)
        relatedProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        if (relatedProjects.length > 0) {
          for (const project of relatedProjects) {
            // Check and fallback for title
            const projectTitle = project.title && project.title.trim() ? project.title : "Unavailable";
  
            // Check and fallback for thumbnail
            const imageExists = await checkImageExists(project.thumbnail);
            const projectThumbnail = imageExists ? project.thumbnail : fallbackThumbnail;
  
            const projectElement = document.createElement("div");
            projectElement.className = "related-project";
            projectElement.innerHTML = `
              <a href="${project.link}">
                <img class="related-project-img" src="${projectThumbnail}" alt="${projectTitle}" onerror="this.src='${fallbackThumbnail}'">
                <span>${projectTitle}</span>
              </a>
            `;
            relatedProjectsContainer.appendChild(projectElement);
          }
        } else {
          relatedProjectsContainer.innerHTML = "<p>No related projects found.</p>";
        }
      })
      .catch(error => {
        console.error("Error loading projects JSON:", error);
        relatedProjectsContainer.innerHTML = "<p>Failed to load related projects.</p>";
      });
  });
  