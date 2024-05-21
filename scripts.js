let currentIndex = 0;
const currentPage = localStorage.getItem('currentPage') || 'hero';
const currentPoem = localStorage.getItem('currentPoem');

// Helper functions
let lastIndex = -1;

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

function handleNavClick(navId, sectionId, renderFunction) {
    document.getElementById(navId).addEventListener('click', () => {
        showSection(sectionId, renderFunction);
        localStorage.setItem('currentPage', sectionId);
        localStorage.removeItem('currentPoem');
    });
}

function renderHero(container) {
    container.innerHTML = `
        <section class="hero" id="hero">
            <span class="hero-text" id="carousel-text"></span>
        </section>
    `;
    updateHeroText();
    setInterval(updateHeroText, 3000);
}

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

function renderAbout(container) {
    container.innerHTML = `
        <section class="about" id="about">
            <h2>${content.about.intro}</h2>
            <div>
                <p>${content.about.description}</p>
                <a href="${content.about.buttonLink}" class="buy-button" target="_blank">${content.about.buttonText}</a>
                <p>${content.about.thanks}</p>
                <p>${content.about.contact}</p>
            </div>
            <footer class="about-footer">
                <p>&copy; 2024 para Estela de Pedro Lucas</p>
            </footer>
        </section>
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

// Set up navigation event listeners
handleNavClick('nav-hero', 'hero', renderHero);
handleNavClick('nav-book', 'book', renderPoems);
handleNavClick('nav-author', 'author', renderAuthor);
handleNavClick('nav-about', 'about', renderAbout);

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
        setInterval(updateHeroText, 3000);
        updateHeroText();
    }
}

initializePage();
