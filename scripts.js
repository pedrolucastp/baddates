let currentIndex = 0;
const currentPage = localStorage.getItem('currentPage') || 'home';
const currentPoem = localStorage.getItem('currentPoem');

// Helper functions
function updateHeroText() {
    const heroTextElement = document.getElementById('carousel-text');
    heroTextElement.innerHTML = content.poems[currentIndex].short_sentence;
    currentIndex = (currentIndex + 1) % content.poems.length;
}

function setActiveNav(navId) {
    document.querySelectorAll('header nav span').forEach(span => {
        span.classList.toggle('active', span.id === navId);
    });
}

function showSection(sectionId) {
    document.querySelectorAll('main > div').forEach(section => {
        section.style.display = section.id === sectionId ? 'flex' : 'none';
    });
}

function handleNavClick(navId, sectionId, renderFunction) {
    document.getElementById(navId).addEventListener('click', () => {
        showSection(sectionId);
        setActiveNav(navId);
        localStorage.setItem('currentPage', sectionId);
        localStorage.removeItem('currentPoem');
        if (renderFunction) renderFunction();
    });
}

function renderPoems() {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.innerHTML = '';
    content.poems.forEach((poem, index) => {
        const card = createPoemCard(poem, index);
        poemCardsContainer.appendChild(card);
    });
    if (currentPoem !== null) {
        const card = poemCardsContainer.children[currentPoem];
        expandCard(card, currentPoem);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        poemCardsContainer.querySelectorAll('.poem-card').forEach(card => {
            card.classList.remove('hidden', 'expanded');
            card.querySelector('p').style.display = 'none';
        });
    }
}

function createPoemCard(poem, index) {
    const card = document.createElement('div');
    card.className = 'poem-card';
    card.innerHTML = `<h3>${poem.title}</h3><p>${poem.text}</p>`;
    card.addEventListener('click', () => expandCard(card, index));
    return card;
}

function renderAuthor() {
    document.getElementById('author-image').src = content.author.image;
    document.getElementById('author-name').innerText = content.author.name;
    document.getElementById('author-bio').innerText = content.author.bio;
}

function renderAbout() {
    document.getElementById('about').innerHTML = `
        <h2>${content.about.intro}</h2>
        <div>
            <p>${content.about.description}</p>
            <a href="${content.about.buttonLink}" class="buy-button" target="_blank">${content.about.buttonText}</a>
            <p>${content.about.thanks}</p>
            <p>${content.about.contact}</p>
        </div>
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
    card.classList.add('hiding');
    card.addEventListener('animationend', () => {
        card.classList.remove('expanded', 'hiding');
        card.querySelector('p').style.display = 'none';
        poemCardsContainer.querySelectorAll('.poem-card').forEach(c => {
            c.classList.remove('hidden');
        });
        card.removeEventListener('click', () => closeCard(card));
        card.addEventListener('click', () => expandCard(card));
        localStorage.removeItem('currentPoem'); // Clear current poem when closing
        card.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, { once: true });
}

// Set up navigation event listeners
handleNavClick('nav-home', 'hero');
handleNavClick('nav-book', 'book', renderPoems);
handleNavClick('nav-author', 'author', renderAuthor);
handleNavClick('nav-about', 'about', renderAbout);

// Initialize the page
function initializePage() {
    showSection(currentPage);
    setActiveNav(`nav-${currentPage}`);
    if (currentPage === 'book') renderPoems();
    if (currentPage === 'author') renderAuthor();
    if (currentPage === 'about') renderAbout();
    setInterval(updateHeroText, 3000);
    updateHeroText();
}

initializePage();
