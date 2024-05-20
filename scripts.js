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
        card.innerHTML = `<h3>${poem.title}</h3>`;
        card.addEventListener('click', () => {
            openModal(poem);
        });
        poemCardsContainer.appendChild(card);
    });
}

function openModal(poem) {
    document.getElementById('modal-title').innerText = poem.title;
    document.getElementById('modal-text').innerText = poem.text;
    document.getElementById('modal').style.display = 'block';
}

document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Set the initial active navigation item
setActiveNav('nav-home');
