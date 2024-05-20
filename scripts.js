let currentIndex = 0;
const currentPage = localStorage.getItem('currentPage') || 'home';
const currentPoem = localStorage.getItem('currentPoem');

function updateHeroText() {
    const heroTextElement = document.getElementById('carousel-text');
    heroTextElement.innerHTML = content.poems[currentIndex].short_sentence;
    currentIndex = (currentIndex + 1) % content.poems.length;
}

setInterval(updateHeroText, 3000); // Change text every 3 seconds
updateHeroText(); // Initial call to set the first text

function setActiveNav(navId) {
    document.querySelectorAll('header nav span').forEach(span => {
        span.classList.remove('active');
    });
    document.getElementById(navId).classList.add('active');
}

document.getElementById('nav-home').addEventListener('click', () => {
    document.getElementById('hero').style.display = 'flex';
    document.getElementById('book').style.display = 'none';
    document.getElementById('author').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    setActiveNav('nav-home');
    localStorage.setItem('currentPage', 'home');
    localStorage.removeItem('currentPoem'); // Clear current poem when navigating to home
});

document.getElementById('nav-book').addEventListener('click', () => {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('book').style.display = 'flex';
    document.getElementById('author').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    renderPoems();
    setActiveNav('nav-book');
    localStorage.setItem('currentPage', 'book');
});

document.getElementById('nav-author').addEventListener('click', () => {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('book').style.display = 'none';
    document.getElementById('author').style.display = 'flex';
    document.getElementById('about').style.display = 'none';
    renderAuthor();
    setActiveNav('nav-author');
    localStorage.setItem('currentPage', 'author');
});

document.getElementById('nav-about').addEventListener('click', () => {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('book').style.display = 'none';
    document.getElementById('author').style.display = 'none';
    document.getElementById('about').style.display = 'flex';
    renderAbout();
    setActiveNav('nav-about');
    localStorage.setItem('currentPage', 'about');
});

function renderPoems() {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.innerHTML = '';
    content.poems.forEach((poem, index) => {
        const card = document.createElement('div');
        card.className = 'poem-card';
        card.innerHTML = `<h3>${poem.title}</h3><p>${poem.text}</p>`;
        card.addEventListener('click', () => {
            expandCard(card, index);
        });
        poemCardsContainer.appendChild(card);
    });

    // Scroll to the previously viewed poem card
    if (currentPoem !== null) {
        const card = poemCardsContainer.children[currentPoem];
        expandCard(card, currentPoem);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function renderAuthor() {
    document.getElementById('author-image').src = content.author.image;
    document.getElementById('author-name').innerText = content.author.name;
    document.getElementById('author-bio').innerText = content.author.bio;
}

function renderAbout() {
    const about = document.getElementById('about');
    about.innerHTML = `
        <h2>${content.about.intro}</h2>
        <p>${content.about.description}</p>
        <a href="${content.about.buttonLink}" class="buy-button" target="_blank">${content.about.buttonText}</a>
        <p>${content.about.thanks}</p>
        <p>${content.about.contact}</p>
    `;
}

function expandCard(card, index) {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.querySelectorAll('.poem-card').forEach(c => {
        if (c !== card) {
            c.classList.add('hidden');
        }
    });
    card.classList.add('expanded');
    card.querySelector('p').style.display = 'block';
    card.removeEventListener('click', () => expandCard(card, index));
    card.addEventListener('click', () => closeCard(card));
    localStorage.setItem('currentPoem', index);
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeCard(card) {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.querySelectorAll('.poem-card').forEach(c => {
        c.classList.remove('hidden');
    });
    card.classList.remove('expanded');
    card.querySelector('p').style.display = 'none';
    card.removeEventListener('click', () => closeCard(card));
    card.addEventListener('click', () => expandCard(card));
    localStorage.removeItem('currentPoem'); // Clear current poem when closing
    card.scrollIntoView({ behavior: 'auto', block: 'center' });
}

// Set the initial active navigation item based on localStorage
if (currentPage === 'book') {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('book').style.display = 'flex';
    document.getElementById('author').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    renderPoems();
    setActiveNav('nav-book');
} else if (currentPage === 'author') {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('book').style.display = 'none';
    document.getElementById('author').style.display = 'flex';
    document.getElementById('about').style.display = 'none';
    renderAuthor();
    setActiveNav('nav-author');
} else if (currentPage === 'about') {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('book').style.display = 'none';
    document.getElementById('author').style.display = 'none';
    document.getElementById('about').style.display = 'flex';
    renderAbout();
    setActiveNav('nav-about');
} else {
    setActiveNav('nav-home');
}
