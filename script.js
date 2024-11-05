const cardImages = [
    'images/halloween1.png',
    'images/halloween2.png',
    'images/halloween3.png',
    'images/halloween4.png',
    'images/halloween5.png',
    'images/halloween6.png',
    'images/halloween7.png',
    'images/halloween8.png',
    'images/halloween9.png'
];

const gameContainer = document.getElementById('game-container');
let cards = [...cardImages, ...cardImages];
let firstCard, secondCard;
let lockBoard = false;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createCards() {
    cards = shuffle(cards);
    cards.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;
        card.innerHTML = `<img src="images/back.png" alt="Card back">`;
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;
    this.classList.add('flipped');
    this.innerHTML = `<img src="${this.dataset.image}" alt="Card image">`;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        // Mozgatás a collected-card konténerbe, fél másodperc várakozás után
        setTimeout(() => {
            moveToCollected(firstCard);
            moveToCollected(secondCard);
            resetBoard();
        }, 500);
    } else {
        setTimeout(flipBack, 850); // Ha nincs találat, 1 mp múlva fordítsa vissza
    }
}

function flipBack() {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.innerHTML = `<img src="images/back.png" alt="Card back">`;
    secondCard.innerHTML = `<img src="images/back.png" alt="Card back">`;
    resetBoard();
}

function moveToCollected(card) {
    const collectedContainer = document.getElementById('collected-card');
    const clonedCard = card.cloneNode(true); // Kártya másolása
    clonedCard.classList.remove('flipped'); // Az eredeti kártya ne maradjon felfordított állapotban
    clonedCard.classList.add('collected'); // Hozzáadja a 'collected' osztályt
    collectedContainer.appendChild(clonedCard); // Kártya hozzáadása a collected-card-hoz


    // Üres hely megtartása
    const emptyCard = document.createElement('div');
    emptyCard.classList.add('card', 'empty'); // Az "empty" osztály biztosítja a megjelenést
    card.replaceWith(emptyCard); 
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

document.getElementById('restart-button').addEventListener('click', () => {
    gameContainer.innerHTML = '';
    createCards();
});

createCards();
