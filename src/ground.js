import { getCustomProp, incrementCustomProp, setCustomProp } from "./updateCustomProp.js";

const SPEED = .05;

const groundElems = document.querySelectorAll("[data-ground]");

export function setUpGround() {
    setCustomProp(groundElems[0], "--left", 0);
    setCustomProp(groundElems[1], "--left", 300);
}

export function updateGround(delta, speedScale) {
    groundElems.forEach((ground) => {
        incrementCustomProp(ground, "--left", delta * speedScale * SPEED * -1);

        if (getCustomProp(ground, "--left") <= -300) {
            incrementCustomProp(ground, "--left", 600);
        }
    });
}