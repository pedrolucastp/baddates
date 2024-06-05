let currentIndex = 0;
const currentPage = localStorage.getItem('currentPage') || 'hero';
const currentPoem = localStorage.getItem('currentPoem');

// Helper functions
function setActiveNav(navId) {
    document.querySelectorAll('header nav span').forEach(span => {
        span.classList.toggle('active', span.id === navId);
    });
}

function showSection(sectionId, renderFunction) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Clear the main content
    if (renderFunction) renderFunction(mainContent);
    setActiveNav(`nav-${sectionId}`);
}

function handleNavClick(navId, sectionId, renderFunction, resetCurrentPoem = false) {
    document.getElementById(navId).addEventListener('click', () => {
        showSection(sectionId, renderFunction);
        localStorage.setItem('currentPage', sectionId);
        if (resetCurrentPoem) {
            localStorage.removeItem('currentPoem');
        }
    });
}

// Home
let lastIndex = -1;
let heroTextInterval;
const heroInterval = 5000 //microseconds

function updateHeroText() {
    const heroTextElement = document.getElementById('carousel-text');
    if (heroTextElement) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * content.poems.length);
        } while (randomIndex === lastIndex);

        heroTextElement.innerHTML = content.poems[randomIndex].short_sentence;
        lastIndex = randomIndex;
    }
}

function renderHero(container) {
    container.innerHTML = `
        <section class="hero" id="hero">
            <span class="hero-text" id="carousel-text"></span>
        </section>
    `;
    updateHeroText();
    if (heroTextInterval) clearInterval(heroTextInterval); // Clear previous interval if exists
    heroTextInterval = setInterval(updateHeroText, heroInterval);
}

// Livro
function setupInfiniteScroll() {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.addEventListener('scroll', () => {
        if (poemCardsContainer.scrollTop + poemCardsContainer.clientHeight >= poemCardsContainer.scrollHeight - 5) {
            appendPoemCards(poemCardsContainer);
        }
    });
}

function appendPoemCards(container) {
    content.poems.forEach((poem, index) => {
        const card = createPoemCard(poem, index);
        container.appendChild(card);
    });
}

function renderPoems(container) {
    container.innerHTML = `
        <section class="book" id="book">
            <div id="poem-cards" class="poem-cards"></div>
        </section>
    `;
    const poemCardsContainer = document.getElementById('poem-cards');
    appendPoemCards(poemCardsContainer);
    if (currentPoem !== null) {
        const card = poemCardsContainer.children[currentPoem];
        expandCard(card, currentPoem);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setupInfiniteScroll();
}

function createPoemCard(poem, index) {
    const card = document.createElement('div');
    card.className = 'poem-card';
    card.innerHTML = `<h3>${poem.title}</h3><p>${poem.text}</p>`;
    card.addEventListener('click', () => expandCard(card, index));
    return card;
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
    card.removeEventListener('click', expandCardListener);
    card.addEventListener('click', closeCardListener);
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
        card.removeEventListener('click', closeCardListener);
        card.addEventListener('click', expandCardListener);
        localStorage.removeItem('currentPoem'); // Clear current poem when closing
        card.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, { once: true });
}

function expandCardListener(event) {
    const card = event.currentTarget;
    const index = Array.from(card.parentNode.children).indexOf(card);
    expandCard(card, index);
}

function closeCardListener(event) {
    const card = event.currentTarget;
    closeCard(card);
}

// Autora
function renderAuthor(container) {
    container.innerHTML = `
        <section class="author" id="author">
            <div>
                <h2 id="author-name">${content.author.name}</h2>
                <p id="author-bio">${content.author.bio}</p>
            </div>
            <img id="author-image" src="${content.author.image}" alt="Author Image">
        </section>
    `;
}

// Sobre
function renderAbout(container) {
    container.innerHTML = `
        <section class="about" id="about">
            <img src="${content.about.cover}" class="cover-image"></img>
            <div>
                <p>${content.about.description}</p>
                <a href="${content.about.buttonLink}" class="buy-button" target="_blank">${content.about.buttonText}</a>
                <p>${content.about.thanks}</p>
                <div class="social-icons">
                <a href="${content.about.links.instagram.link}">
                    <img src="${content.about.links.instagram.icon}" />
                    <span>${content.about.links.instagram.title}</span>
                </a>
                <a href="${content.about.links.pinterest.link}">
                    <img src="${content.about.links.pinterest.icon}">
                    <span>${content.about.links.pinterest.title}</span>

                </a>
            </div>
            </div>
            <footer class="about-footer">
                <p>&copy; 2024 para Estela de Pedro Lucas</p>
            </footer>
        </section>
    `;
}

// Set up navigation event listeners
handleNavClick('nav-hero', 'hero', renderHero);
handleNavClick('nav-book', 'book', renderPoems, true);  // Reset currentPoem when navigating to "Livro"
handleNavClick('nav-author', 'author', renderAuthor);
handleNavClick('nav-about', 'about', renderAbout);

// Add event listener for the home link in the header
document.getElementById('nav-logo').addEventListener('click', () => {
    showSection('hero', renderHero);
    localStorage.setItem('currentPage', 'hero');
    localStorage.removeItem('currentPoem');
});

// Initialize the page
function initializePage() {
    if (currentPage === 'hero') {
        showSection('hero', renderHero);
    } else if (currentPage === 'book') {
        showSection('book', renderPoems);
    } else if (currentPage === 'author') {
        showSection('author', renderAuthor);
    } else if (currentPage === 'about') {
        showSection('about', renderAbout);
    }
    setActiveNav(`nav-${currentPage}`);
    if (currentPage === 'hero') {
        setInterval(updateHeroText, heroInterval);
        updateHeroText();
    }
}

initializePage();
