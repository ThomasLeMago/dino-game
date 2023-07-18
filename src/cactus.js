import { getCustomProp, incrementCustomProp, setCustomProp } from "./updateCustomProp.js";

const SPEED = .05;
const CACTUS_INTERVAl_MIN = 500;
const CACTUS_INTERVAl_MAX = 2000;

const world = document.querySelector("[data-world]");

let nextCactusTime;

export function setUpCactus() {
    nextCactusTime = CACTUS_INTERVAl_MIN;
    document.querySelectorAll("[data-cactus]").forEach(cactus => cactus.remove());
}

export function updateCactus(delta, speedScale) {
    document.querySelectorAll("[data-cactus]").forEach(cactus => {
        incrementCustomProp(cactus, "--left", delta * speedScale * SPEED * -1);
        if (getCustomProp(cactus, "--left") <= -100) {
            cactus.remove();
        }
    });

    if (nextCactusTime <= 0) {
        createCactus();
        nextCactusTime = Math.floor(Math.random() * (CACTUS_INTERVAl_MAX - CACTUS_INTERVAl_MIN + 1) + CACTUS_INTERVAl_MIN);
    }

    nextCactusTime -= delta;
}

export function getCactusRects() {
    return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
        return cactus.getBoundingClientRect();
    });
}

function createCactus() {
    const cactus = document.createElement("img");

    cactus.dataset.cactus = true;
    cactus.src = "assets/cactus.png";
    cactus.classList.add("cactus");

    setCustomProp(cactus, "--left", 100);

    world.append(cactus);
}