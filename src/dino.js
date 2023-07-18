import { getCustomProp, incrementCustomProp, setCustomProp } from "./updateCustomProp.js";

const dino = document.querySelector("[data-dino]");
const JUMP_SPEED = .45;
const GRAVITY = .0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setUpDino() {
    isJumping = false;
    dinoFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;

    setCustomProp(dino, "--bottom", 0);

    document.removeEventListener("keydown", onJump);
    document.addEventListener("keydown", onJump);
}

export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale);
    handleJump(delta);
}

export function getDinoRect() {
    return dino.getBoundingClientRect();
}

export function setDinoLose() {
    dino.src = "assets/dino-lose.png";
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        dino.src = "assets/dino-stationary.png";
        return
    }

    if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
        dino.src = `assets/dino-run-${dinoFrame}.png`;
        
        currentFrameTime -= FRAME_TIME;
    }

    currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
    if (!isJumping) return

    incrementCustomProp(dino, "--bottom", yVelocity * delta);
    
    if (getCustomProp(dino, "--bottom") <= 0) {
        setCustomProp(dino, "--bottom", 0);
        isJumping = false;
    }

    yVelocity -= GRAVITY * delta;
}

function onJump(e) {
    if (e.code !== "Space" || isJumping) return;

    yVelocity = JUMP_SPEED;
    isJumping = true;
}