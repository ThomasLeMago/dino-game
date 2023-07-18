import { setUpGround, updateGround } from "./ground.js";
import { setUpDino, updateDino, getDinoRect, setDinoLose } from "./dino.js";
import { setUpCactus, updateCactus, getCactusRects } from "./cactus.js";

const { invoke } = window.__TAURI__.tauri;

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = .00001;

const world = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

setPixelToWorldScale();

window.addEventListener("resize", setPixelToWorldScale);
window.addEventListener("keydown", handleStart, { once: true });

let lastTime;
let speedScale;
let score;

function update(time) {
  
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return
  }

  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);

  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function setPixelToWorldScale() {
  let worldToPixelScale
  
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  world.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  world.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

function updateScore(delta) {
  score += delta * .01;
  scoreElem.textContent = Math.floor(score);
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some(rect => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;

  setUpGround();
  setUpDino();
  setUpCactus();

  startScreenElem.classList.add("hide");
  window.requestAnimationFrame(update);
}

function handleLose() {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    startScreenElem.classList.remove("hide");
  }, 100);
}