const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");


/* =========================
   GAME VARIABLES
========================= */

let WIDTH;
let HEIGHT;

let playerLane = 1;
let targetLane = 1;

let playerY = 0;
let jumpVelocity = 0;

let score = 0;
let coins = 0;

let gameRunning = false;

let gameSpeed = 6;


/* =========================
   RESIZE
========================= */

function resizeGame() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width =
        WIDTH * dpr;

    canvas.height =
        HEIGHT * dpr;

    canvas.style.width =
        WIDTH + "px";

    canvas.style.height =
        HEIGHT + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


window.addEventListener(
    "resize",
    resizeGame
);

resizeGame();


/* =========================
   LANE POSITION
========================= */

function getLaneX(lane) {

    const distance =
        Math.min(
            WIDTH * 0.23,
            125
        );

    return (
        WIDTH / 2 +
        (lane - 1) * distance
    );
}


/* =========================
   START GAME
========================= */

function startGame() {

    score = 0;
    coins = 0;

    playerLane = 1;
    targetLane = 1;

    playerY = 0;
    jumpVelocity = 0;

    gameSpeed = 6;

    gameRunning = true;

    document
        .getElementById("startScreen")
        .classList.add("hidden");

    document
        .getElementById("gameOver")
        .classList.add("hidden");

    updateHUD();
}


/* =========================
   MOVE LEFT
========================= */

function moveLeft() {

    targetLane--;

    if (targetLane < 0) {

        targetLane = 0;
    }
}


/* =========================
   MOVE RIGHT
========================= */

function moveRight() {

    targetLane++;

    if (targetLane > 2) {

        targetLane = 2;
    }
}


/* =========================
   JUMP
========================= */

function jump() {

    if (playerY === 0) {

        jumpVelocity = 15;
    }
}


/* =========================
   KEYBOARD CONTROLS
========================= */

window.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {

            moveLeft();
        }


        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {

            moveRight();
        }


        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === " "
        ) {

            jump();
        }
    }
);


/* =========================
   MOBILE SWIPE
========================= */

let touchStartX = 0;
let touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    function(event) {

        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;
    },
    { passive: true }
);


canvas.addEventListener(
    "touchend",
    function(event) {

        const endX =
            event.changedTouches[0].clientX;

        const endY =
            event.changedTouches[0].clientY;


        const dx =
            endX - touchStartX;

        const dy =
            endY - touchStartY;


        const absX =
            Math.abs(dx);

        const absY =
            Math.abs(dy);


        if (
            Math.max(absX, absY) < 25
        ) {

            jump();

            return;
        }


        if (absX > absY) {

            if (dx > 0) {

                moveRight();

            } else {

                moveLeft();
            }

        } else {

            if (dy < 0) {

                jump();
            }
        }
    },
    { passive: true }
);


/* =========================
   UPDATE
========================= */

function update(deltaTime) {

    if (!gameRunning) {

        return;
    }


    /* Smooth lane movement */

    playerLane +=
        (
            targetLane -
            playerLane
        ) *
        Math.min(
            1,
            deltaTime * 10
        );


    /* Jump physics */

    jumpVelocity -=
        35 * deltaTime;


    playerY +=
        jumpVelocity *
        deltaTime;


    if (playerY < 0) {

        playerY = 0;

        jumpVelocity = 0;
    }


    /* Score */

    score +=
        deltaTime * 5;


    /* Difficulty */

    gameSpeed +=
        deltaTime * 0.05;


    updateHUD();
}


/* =========================
   DRAW BACKGROUND
========================= */

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
        );


    gradient.addColorStop(
        0,
        "#141a2a"
    );


    gradient.addColorStop(
        .5,
        "#3b414c"
    );


    gradient.addColorStop(
        1,
        "#111318"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );
}


/* =========================
   DRAW ROAD
========================= */

function drawRoad() {

    const horizon =
        HEIGHT * .33;


    ctx.fillStyle =
        "#252329";


    ctx.beginPath();

    ctx.moveTo(
        WIDTH * .38,
        horizon
    );

    ctx.lineTo(
        WIDTH * .62,
        horizon
    );

    ctx.lineTo(
        WIDTH,
        HEIGHT
    );

    ctx.lineTo(
        0,
        HEIGHT
    );

    ctx.closePath();

    ctx.fill();


    /* Lane lines */

    ctx.strokeStyle =
        "#514a45";

    ctx.lineWidth = 2;


    for (
        let lane = 0;
        lane < 3;
        lane++
    ) {

        const topX =
            WIDTH / 2 +
            (
                lane - 1
            ) *
            WIDTH *
            .055;


        const bottomX =
            getLaneX(lane);


        ctx.beginPath();

        ctx.moveTo(
            topX,
            horizon
        );

        ctx.lineTo(
            bottomX,
            HEIGHT
        );

        ctx.stroke();
    }
}


/* =========================
   DRAW PLACEHOLDER PLAYER
========================= */

function drawPlayer() {

    const x =
        getLaneX(playerLane);

    const baseY =
        HEIGHT * .80 -
        playerY;


    /*
       THIS IS TEMPORARY.

       Step 2-ൽ ഇത്
       actual Samurai PNG
       sprite ഉപയോഗിച്ച്
       replace ചെയ്യും.
    */


    ctx.save();

    ctx.translate(
        x,
        baseY
    );


    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,.35)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        5,
        28,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Body */

    ctx.fillStyle =
        "#252832";

    ctx.fillRect(
        -18,
        -65,
        36,
        42
    );


    /* Head */

    ctx.fillStyle =
        "#d49a75";

    ctx.beginPath();

    ctx.arc(
        0,
        -82,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Samurai helmet/hair */

    ctx.fillStyle =
        "#15161b";

    ctx.fillRect(
        -18,
        -91,
        36,
        10
    );


    /* Red armor belt */

    ctx.fillStyle =
        "#9b2935";

    ctx.fillRect(
        -19,
        -35,
        38,
        7
    );


    /* Legs */

    ctx.strokeStyle =
        "#15161b";

    ctx.lineWidth = 10;

    ctx.beginPath();

    ctx.moveTo(
        -8,
        -23
    );

    ctx.lineTo(
        -13,
        2
    );

    ctx.moveTo(
        8,
        -23
    );

    ctx.lineTo(
        13,
        2
    );

    ctx.stroke();


    /* Sword */

    ctx.strokeStyle =
        "#e5e8ed";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        20,
        -42
    );

    ctx.lineTo(
        42,
        -92
    );

    ctx.stroke();


    ctx.restore();
}


/* =========================
   DRAW GAME
========================= */

function draw() {

    drawBackground();

    drawRoad();

    drawPlayer();
}


/* =========================
   HUD
========================= */

function updateHUD() {

    document
        .getElementById("score")
        .textContent =
        Math.floor(score);


    document
        .getElementById("coins")
        .textContent =
        coins;
}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    gameRunning = false;


    document
        .getElementById("finalScore")
        .textContent =
        Math.floor(score);


    document
        .getElementById("finalCoins")
        .textContent =
        coins;


    document
        .getElementById("gameOver")
        .classList.remove("hidden");
}


/* =========================
   GAME LOOP
========================= */

let previousTime = 0;


function gameLoop(time) {

    const deltaTime =
        Math.min(
            (time - previousTime) / 1000,
            0.033
        );


    previousTime = time;


    update(deltaTime);

    draw();


    requestAnimationFrame(
        gameLoop
    );
}


requestAnimationFrame(
    gameLoop
);


/* =========================
   BUTTONS
========================= */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById("restartButton")
    .addEventListener(
        "click",
        startGame
    );
