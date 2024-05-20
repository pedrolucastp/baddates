let currentIndex = 0;

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
    setActiveNav('nav-home');
});

document.getElementById('nav-livro').addEventListener('click', () => {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('livro').style.display = 'flex';
    renderPoems();
    setActiveNav('nav-livro');
});

function renderPoems() {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.innerHTML = '';
    content.poems.forEach((poem, index) => {
        const card = document.createElement('div');
        card.className = 'poem-card';
        card.innerHTML = `<h3>${poem.title}</h3><p>${poem.text}</p>`;
        card.addEventListener('click', () => {
            expandCard(card);
        });
        poemCardsContainer.appendChild(card);
    });
}

function expandCard(card) {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.querySelectorAll('.poem-card').forEach(c => {
        if (c !== card) {
            c.classList.add('hidden');
        }
    });
    card.classList.add('expanded');
    card.querySelector('p').style.display = 'block';
    card.removeEventListener('click', expandCard);
    card.addEventListener('click', () => {
        closeCard(card);
    });
}

function closeCard(card) {
    const poemCardsContainer = document.getElementById('poem-cards');
    poemCardsContainer.querySelectorAll('.poem-card').forEach(c => {
        c.classList.remove('hidden');
    });
    card.classList.remove('expanded');
    card.querySelector('p').style.display = 'none';
    card.removeEventListener('click', closeCard);
    card.addEventListener('click', () => {
        expandCard(card);
    });
}

// Set the initial active navigation item
setActiveNav('nav-home');
