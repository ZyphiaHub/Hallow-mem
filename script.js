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
const maxFlips = 50; // A maximális felfordítások száma
let currentFlips = 0; // Jelenlegi felfordítások száma
let remainingFlips = maxFlips; // Megmaradt felfordítások
const flipCountDisplay = document.getElementById('flip-count');
const rewards = ['fahéjas kalácsot', 'póklábat', 'béka nyelvet', 'üveg csillámport', 'varjúszemet', 'pumpkin spice lattét', 'koporsószeget', 'fekete gyémántot', 'kopogó szellemet', 'kiscicát'];



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
        console.log("Kártyák száma a táblán:", gameContainer.children.length);
    });
}

// A felfordítások számának frissítése a kiíráshoz
function updateFlipCount() {
    flipCountDisplay.textContent = `Max felfordítások: ${maxFlips} | Jelenlegi felfordítások: ${currentFlips} | Még ennyiszer fordíthatsz fel kártyát: ${remainingFlips}`;
}

function flipCard() {
    // Csak akkor felfordítható a kártya, ha nem zárva a tábla, és ha ez nem az első kártya
    if (lockBoard || this === firstCard || secondCard) return;
    
    this.classList.add('flipped');
    this.innerHTML = `<img src="${this.dataset.image}" alt="Card image">`;

    currentFlips++; // Felfordítások számának növelése
    remainingFlips = maxFlips - currentFlips;
    updateFlipCount(); // Frissít

     // a maximumot túlléptük?
     if (currentFlips > maxFlips) {
        alert("Minden határon túlmentél! A játék újraindul."); 
        restartGame(); 
        return; // Ne folytassuk a kártyák felfordítását
    }

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function restartGame() {
    gameContainer.innerHTML = '';
    document.getElementById('collected-card').innerHTML = ''; // Ürítjük a collected-card konténert is
    currentFlips = 0; // Visszaállítjuk a felfordítások számát
    remainingFlips = maxFlips;
    updateFlipCount(); // Frissítsük a kiírást
    createCards(); // Új kártyák létrehozása
}
// A játék újraindítása gombbal
document.getElementById('restart-button').addEventListener('click', () => {
    gameContainer.innerHTML = ''; //ürít
    document.getElementById('collected-card').innerHTML = ''; // ürít
    createCards();
    currentFlips = 0; // Visszaállítjuk a felfordítások számát
    remainingFlips = maxFlips;
    updateFlipCount(); // Frissít
});

function checkForMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        // Mozgatás a collected-card konténerbe, fél másodperc várakozás után
        setTimeout(() => {
            moveToCollected(firstCard);
            moveToCollected(secondCard);
            resetBoard();

            // Ellenőrizzük, hogy elfogytak-e a kártyák a játéktáblán
            console.log("Kártyák száma :", gameContainer.children.length);
            const collectedCardsCount = countCollectedCards();
            if (collectedCardsCount === 9) { 
                const randomIndex = Math.floor(Math.random() * rewards.length);
                const randomReward = rewards[randomIndex];

                alert(`Minden kártyát összegyűjtöttél! Nyertél ${remainingFlips} ${randomReward}!`);
                updateFlipCount();
                restartGame(); // Opció: újraindítás
            }

        }, 500);
    } else {
        setTimeout(flipBack, 850); // Ha nincs találat, ennyi idő múlva fordítsa vissza
    }
}

function countCollectedCards() {
    const collectedContainer = document.getElementById('collected-card');
    const collectedCardsCount = collectedContainer.children.length; // A gyerek elemek számának lekérése
    console.log("A collected-card konténerben lévő kártyák száma:", collectedCardsCount);
    return collectedCardsCount; // Visszatér a kártyák számával
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
    const imageSrc = card.dataset.image; // Az aktuális kártya képének elérési útja

    // A kártya már a collected-containerben van?
    const existingCard = Array.from(collectedContainer.children).find(collectedCard => {
        return collectedCard.dataset.image === imageSrc; // Megkeressük az azonos képű kártyát
    });

    if (!existingCard) {
        const clonedCard = card.cloneNode(true); // Kártya másolása
        clonedCard.classList.remove('flipped'); // Az eredeti kártya ne maradjon felfordított állapotban
        clonedCard.classList.add('collected'); // Hozzáadjuk a 'collected' osztályt
        collectedContainer.appendChild(clonedCard); // Kártya hozzáadása a collected-card-hoz
    }

    
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

// Kártyák létrehozása a játék kezdetekor
createCards();
updateFlipCount();
