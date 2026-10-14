// 1. Baraja vectorizada en SVG (Oros, Copas, Espadas, Bastos)
const spanishCards = [
  {
    id: 'oro_1',
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#f59e0b" stroke="#b45309" stroke-width="6"/><circle cx="50" cy="50" r="28" fill="none" stroke="#b45309" stroke-width="3"/><text x="50" y="58" font-size="22" font-weight="bold" text-anchor="middle" fill="#78350f">ORO</text></svg>`
  },
  {
    id: 'copa_1',
    svg: `<svg viewBox="0 0 100 100"><path d="M 30 20 L 70 20 L 65 55 C 65 65 35 65 35 55 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4"/><rect x="45" y="60" width="10" height="20" fill="#991b1b"/><rect x="30" y="80" width="40" height="8" rx="3" fill="#991b1b"/></svg>`
  },
  {
    id: 'espada_1',
    svg: `<svg viewBox="0 0 100 100"><path d="M 50 10 L 58 65 L 50 70 L 42 65 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/><rect x="25" y="70" width="50" height="6" rx="2" fill="#1e3a8a"/><rect x="46" y="76" width="8" height="18" fill="#1e3a8a"/><circle cx="50" cy="96" r="5" fill="#1e3a8a"/></svg>`
  },
  {
    id: 'basto_1',
    svg: `<svg viewBox="0 0 100 100"><path d="M 42 15 Q 50 10 58 15 L 54 85 Q 50 90 46 85 Z" fill="#854d0e" stroke="#451a03" stroke-width="3"/><circle cx="38" cy="30" r="4" fill="#15803d"/><circle cx="62" cy="45" r="4" fill="#15803d"/><circle cx="38" cy="60" r="4" fill="#15803d"/></svg>`
  },
  {
    id: 'oro_rey',
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#f59e0b" stroke="#b45309" stroke-width="6"/><text x="50" y="58" font-size="28" font-weight="bold" text-anchor="middle" fill="#ffffff">👑</text></svg>`
  },
  {
    id: 'copa_rey',
    svg: `<svg viewBox="0 0 100 100"><path d="M 25 30 L 75 30 L 70 70 C 70 80 30 80 30 70 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="4"/><text x="50" y="58" font-size="28" font-weight="bold" text-anchor="middle" fill="#ffffff">🍷</text></svg>`
  }
];

// Variables de estado del juego
let cardsData = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let attempts = 0;

// Elementos del DOM
const gameBoard = document.getElementById('gameBoard');
const pairsCountSpan = document.getElementById('pairsCount');
const attemptsCountSpan = document.getElementById('attemptsCount');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

// 2. Duplicar y mezclar cartas (Fisher-Yates)
function prepareCards() {
  cardsData = [...spanishCards, ...spanishCards];

  for (let i = cardsData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardsData[i], cardsData[j]] = [cardsData[j], cardsData[i]];
  }
}

// 3. Crear tablero en el DOM
function createBoard() {
  gameBoard.innerHTML = '';

  cardsData.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.cardId = card.id;
    cardElement.dataset.index = index;

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-back">🎴</div>
        <div class="card-front">
          ${card.svg}
        </div>
      </div>
    `;

    cardElement.addEventListener('click', flipCard);
    gameBoard.appendChild(cardElement);
  });
}

// 4. Lógica de volteo
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains('matched')) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  attempts++;
  attemptsCountSpan.innerText = attempts;

  checkMatch();
}

// 5. Comprobar si coinciden
function checkMatch() {
  const isMatch = firstCard.dataset.cardId === secondCard.dataset.cardId;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// 6. Pareja correcta
function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  matchedPairs++;
  pairsCountSpan.innerText = matchedPairs;

  resetSelection();

  if (matchedPairs === spanishCards.length) {
    setTimeout(() => {
      messageDiv.innerText = `¡Felicidades! 🎉 Has encontrado todas las parejas en ${attempts} intentos.`;
    }, 300);
  }
}

// 7. Pareja incorrecta (voltear de nuevo con setTimeout)
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');

    resetSelection();
  }, 1000);
}

function resetSelection() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// 8. Reiniciar partida
function resetGame() {
  matchedPairs = 0;
  attempts = 0;
  pairsCountSpan.innerText = 0;
  attemptsCountSpan.innerText = 0;
  messageDiv.innerText = '';
  resetSelection();
  prepareCards();
  createBoard();
}

restartBtn.addEventListener('click', resetGame);

// Iniciar al cargar
resetGame();