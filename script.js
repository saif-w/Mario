const player = document.getElementById('player');
const enemies = document.querySelectorAll('.enemy');
const coins = document.querySelectorAll('.coin');
const powers = document.querySelectorAll('.power');
const scoreText = document.getElementById('score');
const pookie = document.getElementById('pookie');

let jumping = false;
let isAlive = true;
let score = 0;
let x = 100;
let speed = 5;
let poweredUp = false;

let keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function jump() {
  if (jumping) return;
  jumping = true;
  let jumpHeight = 0;
  let up = setInterval(() => {
    if (jumpHeight >= 100) {
      clearInterval(up);
      let down = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(down);
          jumping = false;
        } else {
          jumpHeight -= 5;
          player.style.bottom = 100 + jumpHeight + 'px';
        }
      }, 20);
    } else {
      jumpHeight += 5;
      player.style.bottom = 100 + jumpHeight + 'px';
    }
  }, 20);
}

function checkCollision(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return (
    ar.left < br.right &&
    ar.right > br.left &&
    ar.bottom > br.top &&
    ar.top < br.bottom
  );
}

setInterval(() => {
  if (!isAlive) return;

  if (keys['ArrowLeft']) {
    x -= speed;
    player.style.transform = 'scaleX(-1)';
  }
  if (keys['ArrowRight']) {
    x += speed;
    player.style.transform = 'scaleX(1)';
  }
  if (keys['ArrowUp']) jump();

  player.style.left = x + 'px';

  enemies.forEach(enemy => {
    let ex = parseInt(enemy.style.left);
    ex -= 3;
    if (ex < -50) ex = window.innerWidth + Math.random() * 400;
    enemy.style.left = ex + 'px';

    if (checkCollision(player, enemy)) {
      if (poweredUp) {
        enemy.style.display = 'none';
      } else {
        isAlive = false;
        alert("Game Over! Final Score: " + score);
        location.reload();
      }
    }
  });

  coins.forEach(coin => {
    if (coin.style.display !== 'none' && checkCollision(player, coin)) {
      coin.style.display = 'none';
      score += 10;
      scoreText.textContent = 'Score: ' + score;
    }
  });

  powers.forEach(power => {
    if (power.style.display !== 'none' && checkCollision(player, power)) {
      power.style.display = 'none';
      poweredUp = true;
      player.style.width = '60px';
      setTimeout(() => {
        poweredUp = false;
        player.style.width = '50px';
      }, 5000);
    }
  });

  if (pookie && checkCollision(player, pookie)) {
    alert("🎉 You saved Prince Pookie! 🎉\nFinal Score: " + score);
    isAlive = false;
    location.reload();
  }

}, 30);
