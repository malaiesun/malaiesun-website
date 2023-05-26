document.addEventListener('DOMContentLoaded', () => {
  const toggleLink = document.getElementById('toggleLink');
  const featuredSection = document.getElementById('featured');
  const archiveSection = document.getElementById('archive');

  toggleLink.addEventListener('click', () => {
    if (toggleLink.textContent === 'Archive') {
      toggleLink.setAttribute('href', '#archive');
      toggleLink.textContent = 'Featured';
    } else {
      toggleLink.setAttribute('href', '#featured');
      toggleLink.textContent = 'Archive';
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === featuredSection && entry.isIntersecting && toggleLink.textContent !== 'Archive') {
        toggleLink.setAttribute('href', '#archive');
        toggleLink.textContent = 'Archive';
      } else if (entry.target === archiveSection && entry.isIntersecting && toggleLink.textContent !== 'Featured') {
        toggleLink.setAttribute('href', '#featured');
        toggleLink.textContent = 'Featured';
      }
    });
  }, observerOptions);

  observer.observe(featuredSection);
  observer.observe(archiveSection);

  // Scroll Event Listener
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const featuredSectionOffset = featuredSection.offsetTop ; 
    const archiveSectionOffset = archiveSection.offsetTop - 400 ; 
    const featuredSectionHeight = featuredSection.offsetHeight;

    if (
      scrollPosition >= featuredSectionOffset &&
      scrollPosition < archiveSectionOffset  &&
      toggleLink.textContent !== 'Archive'
    ) {
      toggleLink.setAttribute('href', '#archive');
      toggleLink.textContent = 'Archive';
    } else if (
      scrollPosition >= archiveSectionOffset  &&
      scrollPosition < archiveSectionOffset + featuredSectionHeight &&
      toggleLink.textContent !== 'Featured'
    ) {
      toggleLink.setAttribute('href', '#featured');
      toggleLink.textContent = 'Featured';
    }
  });
});

//scroll flexbox

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.featured-projects').addEventListener('wheel', function(event) {
    event.preventDefault();
    var container = event.currentTarget;
    container.scrollLeft += event.deltaY;
  });
});

//search flexbox
document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchBox');
  const featuredCards = document.querySelectorAll('.featured-card');
  const noResultsMessage = document.getElementById('noResultsMessage');
  const originalCardStyles = [];

  featuredCards.forEach(card => {
    originalCardStyles.push(card.style.display);
  });

  const filterCards = searchTerm => {
    let matchFound = false;

    featuredCards.forEach((card, index) => {
      const heading = card.querySelector('h2');
      const cardText = heading.textContent.toLowerCase().replace(/\s+/g, '');

      if (cardText.includes(searchTerm)) {
        card.style.display = originalCardStyles[index];
        matchFound = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (matchFound) {
      noResultsMessage.style.display = 'none';
    } else {
      noResultsMessage.style.display = 'block';
    }
  };

  searchBox.addEventListener('input', () => {
    const searchTerm = searchBox.value.trim().toLowerCase().replace(/\s+/g, '');
    filterCards(searchTerm);
  });

  searchBox.addEventListener('blur', () => {
    if (searchBox.value === '') {
      featuredCards.forEach((card, index) => {
        card.style.display = originalCardStyles[index];
      });
      noResultsMessage.style.display = 'none';
    }
  });
});
