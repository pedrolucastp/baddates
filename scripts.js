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
    document.getElementById('livro').style.display = 'none';
    document.getElementById('autora').style.display = 'none';
    setActiveNav('nav-home');
    localStorage.setItem('currentPage', 'home');
    localStorage.removeItem('currentPoem'); // Clear current poem when navigating to home
});

document.getElementById('nav-livro').addEventListener('click', () => {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('livro').style.display = 'flex';
    document.getElementById('autora').style.display = 'none';
    renderPoems();
    setActiveNav('nav-livro');
    localStorage.setItem('currentPage', 'livro');
});

document.getElementById('nav-autora').addEventListener('click', () => {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('livro').style.display = 'none';
    document.getElementById('autora').style.display = 'flex';
    renderAutora();
    setActiveNav('nav-autora');
    localStorage.setItem('currentPage', 'autora');
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

function renderAutora() {
    document.getElementById('autora-image').src = content.autora.image;
    document.getElementById('autora-title').innerText = content.autora.title;
    document.getElementById('autora-description').innerText = content.autora.description;
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
if (currentPage === 'livro') {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('livro').style.display = 'flex';
    renderPoems();
    setActiveNav('nav-livro');
} else if (currentPage === 'autora') {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('livro').style.display = 'none';
    document.getElementById('autora').style.display = 'flex';
    renderAutora();
    setActiveNav('nav-autora');
} else {
    setActiveNav('nav-home');
}
