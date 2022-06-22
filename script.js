// Canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let gameOver = false;

let is_dragging;
let current_fish_index = null;
let mouse_in_fish = false;
let startX;
let startY;

ctx.font = "50px Georgia";

let canvasPosition = canvas.getBoundingClientRect();

// Xac dinh vi tri chuot

let is_mouse_in_shape = function (x, y, enemy) {
  let shape_left = enemy.x - enemy.radius * 1.75;
  let shape_right = shape_left + enemy.radius * 2.5;
  let shape_top = enemy.y - enemy.radius * 1.75;
  let shape_bottom = enemy.y + enemy.radius * 1.75;

  if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
    console.log("in");
    return true;
  } else {
    console.log("not in");
    return false;
  }
};

let mouse_down = function (event) {
  event.preventDefault();

  startX = parseInt(event.clientX - canvasPosition.left);
  startY = parseInt(event.clientY - canvasPosition.top);

  // console.log("startX, startY", startX, startY);

  let index = 0;

  for (let enemy of enemiesArray) {
    if (is_mouse_in_shape(startX, startY, enemy)) {
      current_fish_index = index;

      is_dragging = true;
      return;
    } else {
    }
    index++;
  }
};

let mouse_up = function (event) {
  if (!is_dragging) {
    return;
  }
  event.preventDefault();
  is_dragging = false;
};

let mouse_out = function (event) {
  if (!is_dragging) {
    return;
  }
  event.preventDefault();
  is_dragging = false;
};

let mouse_move = async (event) => {
  if (!is_dragging) {
    return;
  } else {
    event.preventDefault();
    let mouseX = parseInt(event.clientX - canvasPosition.left);
    let mouseY = parseInt(event.clientY - canvasPosition.top);

    // console.log("mouseX, mouseY", mouseX, mouseY);
    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let current_fish = enemiesArray[current_fish_index];

    current_fish.x += dx;
    current_fish.y += dy;

    startX = mouseX;
    startY = mouseY;
  }
};

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmouseout = mouse_out;
canvas.onmousemove = mouse_move;

// Chest
const chestImage = new Image();
chestImage.src = "../src/chest/RED-OPEN.png";

class Chest {
  constructor() {
    this.x = canvas.width * 0.5;
    this.y = canvas.height * 0.7;
    this.distance;
    this.radius = 30;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      canvas.width * 0.52,
      canvas.height * 0.82,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(
      chestImage,
      canvas.width * 0.45,
      this.y,
      canvas.width * 0.15,
      canvas.width * 0.15
    );
  }
}

const chest = new Chest();

// Bubbles

const bubblesArray = [];

const bubbleImage = new Image();
bubbleImage.src = "../src/bubble-pop/bubble_pop_frame_01.png";
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    (this.sound = Math.random() <= 0), 5 ? "sound1" : "sound2";
  }
  update() {
    this.y -= this.speed;
  }
  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    ctx.drawImage(
      bubbleImage,
      this.x - 65,
      this.y - 65,
      this.radius * 2.6,
      this.radius * 2.6
    );
  }
}

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
  }
}

// Enemies
const enemyImage = new Image();
enemyImage.src = "../src/enemy/__red_cartoon_fish_01_swim.png";

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = randomInteger(1, canvas.height * 0.45);
    this.radius = 60;
    this.speed = Math.random() * 0.25 + 1;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 418;
    this.spriteHeight = 397;
    this.catchFish = true;
    this.distance;
  }
  draw() {
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.font = "30px red Arial";
    ctx.fillText("Hello World", this.x - 30, this.y + 30);
    ctx.fill();
    ctx.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 60,
      this.y - 70,
      this.spriteWidth / 3,
      this.spriteWidth / 3
    );
  }

  update() {
    this.x -= this.speed;

    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = randomInteger(90, 220);
      this.speed = Math.random() * 2 + 2;
    }
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frame = 2;
      else this.frameY = 0;
    }
    const dx = this.x - chest.x;
    const dy = this.y - chest.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
    if (this.distance < this.radius + chest.radius) {
    }
  }
}

function handleCatchFish() {
  if (gameFrame % 60 == 0 && gameFrame < 250) {
    enemiesArray.push(new Enemy());
  }
  for (let i = 0; i < enemiesArray.length; i++) {
    enemiesArray[i].update();
    enemiesArray[i].draw();

    if (enemiesArray[i].distance < enemiesArray[i].radius + chest.radius) {
      enemiesArray.splice(i, 1);
      is_dragging = false;
      handleGameOver(i);
    }
  }
}

let enemiesArray = [];

function handleGameOver(i) {
  ctx.fillStyle = "black";
  OpenBootstrapPopup();

  ctx.fillText(`Bắt được con số ${i}`, 100, 100);
  gameOver = true;
}

function OpenBootstrapPopup() {
  $("#myModal").modal("show");
}

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  chest.draw();
  handleCatchFish();
  gameFrame++;
  // if (!gameOver)
  requestAnimationFrame(animate);
}

animate();
