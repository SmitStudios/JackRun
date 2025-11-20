const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
let gameStarted = false;

// CLOUDS
const clouds = [
  { x: 50, y: 60, width: 100, height: 50, speed: 0.2 },
  { x: 300, y: 100, width: 120, height: 60, speed: 0.1 },
  { x: 600, y: 50, width: 90, height: 45, speed: 0.15 }
];

// PLAYER & ENEMIES
class Sprite {
  constructor(x, y, width, height, imageSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.vy = 0;
    this.onGround = false;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.vy += gravity;
    this.y += this.vy;

    if(this.y + this.height > canvas.height - 50) {
      this.y = canvas.height - 50 - this.height;
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    this.draw();
  }
}

const jack = new Sprite(100, 0, 50, 50, 'images/jack.png');
const playButtons = [
  new Sprite(400, 0, 40, 40, 'images/playbutton.png'),
  new Sprite(600, 0, 40, 40, 'images/playbutton.png')
];

// KEYS
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;

  // Start game on Enter
  if(!gameStarted && e.key === 'Enter') {
    gameStarted = true;
    document.getElementById('startText').style.display = 'none';
    document.getElementById('subText').style.display = 'none';
  }
});
document.addEventListener('keyup', e => keys[e.key] = false);

// DRAW CLOUD FUNCTION
function drawCloud(cloud) {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(cloud.x, cloud.y, cloud.width / 2, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.width / 3, cloud.y - 10, cloud.width / 3, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.width / 2, cloud.y, cloud.width / 2, 0, Math.PI * 2);
  ctx.fill();
}

// GAME LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Clouds
  clouds.forEach(cloud => {
    cloud.x -= cloud.speed;
    if(cloud.x + cloud.width < 0) cloud.x = canvas.width;
    drawCloud(cloud);
  });

  if(gameStarted) {
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Move Jack
    if(keys['ArrowLeft']) jack.x -= 5;
    if(keys['ArrowRight']) jack.x += 5;
    if(keys['ArrowUp'] && jack.onGround) jack.vy = -10;

    jack.update();

    // Enemies
    playButtons.forEach(pb => pb.update());
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
