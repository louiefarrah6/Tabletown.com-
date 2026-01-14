script.js
// Simple free-play slot game

const symbols = ["🍒", "🍋", "⭐", "7️⃣", "🍀"];

const payouts = {
  "7️⃣,7️⃣,7️⃣": 50,  // 50x bet
  "⭐,⭐,⭐": 20,      // 20x bet
  "🍒,🍒,🍒": 10     // 10x bet
};

const balanceEl = document.getElementById("balance");
const reel1El = document.getElementById("reel1");
const reel2El = document.getElementById("reel2");
const reel3El = document.getElementById("reel3");
const betInput = document.getElementById("bet-input");
const spinBtn = document.getElementById("spin-btn");
const messageEl = document.getElementById("message");

// Load balance from localStorage or start with 1000
let balance = parseInt(localStorage.getItem("slotBalance") || "1000", 10);

function saveBalance() {
  localStorage.setItem("slotBalance", balance.toString());
}

function updateBalanceDisplay() {
  balanceEl.textContent = balance;
}

function spinReel() {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

function spinSlots(betAmount) {
  const r1 = spinReel();
  const r2 = spinReel();
  const r3 = spinReel();

  const comboKey = `${r1},${r2},${r3}`;
  let multiplier = 0;

  if (payouts[comboKey]) {
    multiplier = payouts[comboKey];
  } else if (r1 === r2 || r2 === r3 || r1 === r3) {
    // any 2 matching
    multiplier = 2;
  }

  const winAmount = betAmount * multiplier;

  return {
    reels: [r1, r2, r3],
    winAmount
  };
}

spinBtn.addEventListener("click", () => {
  messageEl.textContent = "";

  const bet = parseInt(betInput.value, 10);

  if (isNaN(bet) || bet <= 0) {
    messageEl.textContent = "Enter a valid bet.";
    return;
  }

  if (bet > balance) {
    messageEl.textContent = "Not enough coins!";
    return;
  }

  // Take bet
  balance -= bet;

  const result = spinSlots(bet);

  // Show reels
  reel1El.textContent = result.reels[0];
  reel2El.textContent = result.reels[1];
  reel3El.textContent = result.reels[2];

  // Add winnings
  balance += result.winAmount;

  updateBalanceDisplay();
  saveBalance();

  if (result.winAmount > 0) {
    messageEl.textContent = `You won ${result.winAmount} coins!`;
  } else {
    messageEl.textContent = "No win this time.";
  }
});

// Initialize display
updateBalanceDisplay();
