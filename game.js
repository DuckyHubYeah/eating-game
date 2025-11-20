// Eating game with buttons to spawn specific foods
// Player can walk to a food, pick it up, and eat it

const playfield = document.getElementById('playfield');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');

let score = 0;
let playerX = 200;
let carrying = null;
let keys = {};

// food types
const foodList = ["🍎","🍌","🍕","🍪"];

// attach button listeners
foodList.forEach(f => {
  const btn = document.getElementById(`btn-${f}`);
  btn.addEventListener('click', () => spawnFood(f));
});

function spawnFood(emoji){
  const el = document.createElement('div');
  el.className = 'food';
  el.textContent = emoji;
  el.style.top = '120px';
  el.style.left = Math.random() * 300 + 'px';
  playfield.appendChild(el);
}

function pickUp(f){
  if (carrying) return;
  carrying = f.textContent;
  playfield.removeChild(f);
  updateMessage(`Carrying ${carrying}`);
}

function eat(){
  if (!carrying) return;
  score += 10;
  scoreEl.textContent = score;
  updateMessage(`Ate ${carrying}!`);
  carrying = null;
}

function updateMessage(msg){
  document.getElementById('messages').textContent = msg;
}

// movement
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space') eat();
});
window.addEventListener('keyup', e => keys[e.code] = false);

function movePlayer(dt){
  if (keys['ArrowLeft']) playerX -= 0.2 * dt;
  if (keys['ArrowRight']) playerX += 0.2 * dt;
  playerX = Math.max(0, Math.min(360, playerX));
  player.style.left = playerX + 'px';
}

function loop(now){
  movePlayer(16);

  // collision check
  const foods = Array.from(document.querySelectorAll('.food'));
  const playerRect = player.getBoundingClientRect();

  foods.forEach(f => {
    const r = f.getBoundingClientRect();
    if (r.left < playerRect.right && r.right > playerRect.left && r.top < playerRect.bottom && r.bottom > playerRect.top) {
      pickUp(f);
    }
  });

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
