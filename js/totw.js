const positions = [
    "Goalkeeper",
    "Defender",
    "Defender",
    "Defender",
    "Defender",
    "Midfielder",
    "Midfielder",
    "Midfielder",
    "Forward",
    "Forward",
    "Forward"
];

const samplePlayers = [
    ["Goalkeeper One", "Mens 1s", "Clean Sheet | POTM"],
    ["Defender One", "Ladies 1s", "POTM | 3-1 Win"],
    ["Defender Two", "Mens 2s", "1 Goal | 4-2 Win"],
    ["Defender Three", "Ladies 2s", "Clean Sheet | POTM"],
    ["Defender Four", "Mens 3s", "2 Assists | 3-0 Win"],
    ["Midfielder One", "Ladies 1s", "1 Goal | POTM"],
    ["Tommy Brown", "Mens 2s", "2 Goals | POTM | 4-1 Win"],
    ["Midfielder Three", "Ladies 3s", "2 Goals | 3-2 Win"],
    ["Forward One", "Mens 1s", "Hat-trick | POTM"],
    ["Forward Two", "Ladies 2s", "2 Goals | 4-0 Win"],
    ["Forward Three", "Mens 3s", "1 Goal | POTM"]
];


// ====================================================
// PITCH IMAGE
// ====================================================

const pitchImage = new Image();
pitchImage.src = "./assets/Pitch.png";


// ====================================================
// BUILD PLAYER INPUTS
// ====================================================

function buildPlayerInputs() {

    const container = document.getElementById("players");

    positions.forEach((position, index) => {

        const player = samplePlayers[index];

        const div = document.createElement("div");
        div.className = "player";

        div.innerHTML = `
            <div class="player-title">
                ${index + 1}. ${position}
            </div>

            <div class="player-row">
                <input
                    id="name-${index}"
                    value="${player[0]}"
                    placeholder="Player name">

                <input
                    id="squad-${index}"
                    value="${player[1]}"
                    placeholder="Squad">
            </div>

            <input
                class="reason"
                id="reason-${index}"
                value="${player[2]}"
                placeholder="Reasons separated with |">
        `;

        container.appendChild(div);
    });
}


// ====================================================
// ROUNDED RECTANGLE
// ====================================================

function roundedRect(ctx, x, y, width, height, radius) {

    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
}


// ====================================================
// DRAW PLAYER
// ====================================================

function drawPlayer(ctx, x, y, index) {

    const name =
        document.getElementById(`name-${index}`).value.trim();

    const squad =
        document.getElementById(`squad-${index}`).value.trim();

    const reasonText =
        document.getElementById(`reason-${index}`).value.trim();

    const reasons = reasonText
        .split("|")
        .map(reason => reason.trim())
        .filter(Boolean);


    // ------------------------------------------------
    // PLAYER MARKER
    // ------------------------------------------------

    ctx.beginPath();
    ctx.arc(x, y, 29, 0, Math.PI * 2);

    ctx.fillStyle = "#202133";
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f2cf44";
    ctx.stroke();


    // Position / player number

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 21px Arial";

    ctx.fillText(index + 1, x, y + 1);


    // ------------------------------------------------
    // NAME
    // ------------------------------------------------

    const nameY = y + 47;

    ctx.font = "bold 20px Arial";

    const nameWidth = Math.max(
        145,
        ctx.measureText(name.toUpperCase()).width + 24
    );

    ctx.fillStyle = "rgba(32, 33, 51, 0.96)";

    roundedRect(
        ctx,
        x - nameWidth / 2,
        nameY - 17,
        nameWidth,
        34,
        8
    );

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        name.toUpperCase(),
        x,
        nameY
    );


    // ------------------------------------------------
    // SQUAD
    // ------------------------------------------------

    const squadY = nameY + 30;

    ctx.font = "bold 16px Arial";

    const squadWidth = Math.max(
        88,
        ctx.measureText(squad).width + 22
    );

    ctx.fillStyle = "#f2cf44";

    roundedRect(
        ctx,
        x - squadWidth / 2,
        squadY - 13,
        squadWidth,
        26,
        7
    );

    ctx.fillStyle = "#202133";

    ctx.fillText(
        squad,
        x,
        squadY
    );


    // ------------------------------------------------
    // PERFORMANCE REASONS
    // ------------------------------------------------

    let reasonY = squadY + 29;

    ctx.font = "bold 15px Arial";

    reasons.forEach(reason => {

        const reasonWidth = Math.max(
            100,
            ctx.measureText(reason).width + 20
        );

        ctx.fillStyle = "rgba(32, 33, 51, 0.92)";

        roundedRect(
            ctx,
            x - reasonWidth / 2,
            reasonY - 12,
            reasonWidth,
            24,
            6
        );

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            reason,
            x,
            reasonY
        );

        reasonY += 26;
    });
}


// ====================================================
// DRAW GRAPHIC
// ====================================================

function generateGraphic() {

    const canvas =
        document.getElementById("totwCanvas");

    const ctx =
        canvas.getContext("2d");


    // Clear canvas

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ------------------------------------------------
    // NAVY BACKGROUND
    // ------------------------------------------------

    ctx.fillStyle = "#202133";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ------------------------------------------------
    // HEADER
    // ------------------------------------------------

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Arial";

    ctx.fillText(
        "SAINTFIELD HOCKEY CLUB",
        canvas.width / 2,
        65
    );


    ctx.fillStyle = "#f2cf44";
    ctx.font = "bold 42px Arial";

    ctx.fillText(
        "TEAM OF THE WEEK",
        canvas.width / 2,
        118
    );


    const season =
        document.getElementById("season").value;

    const weekend =
        document.getElementById("weekend").value;


    ctx.fillStyle = "#ffffff";
    ctx.font = "23px Arial";

    ctx.fillText(
        `${season}  •  ${weekend}`,
        canvas.width / 2,
        158
    );


    // ------------------------------------------------
    // WAIT FOR PITCH IMAGE
    // ------------------------------------------------

    if (
        !pitchImage.complete ||
        pitchImage.naturalWidth === 0
    ) {

        ctx.fillStyle = "#ffffff";
        ctx.font = "24px Arial";

        ctx.fillText(
            "Loading pitch...",
            canvas.width / 2,
            canvas.height / 2
        );

        return;
    }


    // ------------------------------------------------
    // FIT PITCH INTO AVAILABLE SPACE
    // ------------------------------------------------

    const areaX = 25;
    const areaY = 185;

    const areaWidth =
        canvas.width - 50;

    const areaHeight =
        canvas.height - areaY - 25;


    const imageRatio =
        pitchImage.naturalWidth /
        pitchImage.naturalHeight;

    const areaRatio =
        areaWidth /
        areaHeight;


    let drawWidth;
    let drawHeight;


    if (imageRatio > areaRatio) {

        drawWidth = areaWidth;
        drawHeight = drawWidth / imageRatio;

    } else {

        drawHeight = areaHeight;
        drawWidth = drawHeight * imageRatio;
    }


    const pitchX =
        (canvas.width - drawWidth) / 2;

    const pitchY =
        areaY +
        ((areaHeight - drawHeight) / 2);


    ctx.drawImage(
        pitchImage,
        pitchX,
        pitchY,
        drawWidth,
        drawHeight
    );


    // =================================================
    // FIXED 1-4-3-3 FORMATION
    //
    // X/Y are percentages of the pitch image.
    // Team attacks towards the TOP.
    // =================================================

    const formation = [

        // GK
        [0.50, 0.82],

        // DEF
        [0.18, 0.64],
        [0.39, 0.64],
        [0.61, 0.64],
        [0.82, 0.64],

        // MID
        [0.27, 0.41],
        [0.50, 0.41],
        [0.73, 0.41],

        // FWD
        [0.27, 0.17],
        [0.50, 0.17],
        [0.73, 0.17]
    ];


    formation.forEach(
        ([relativeX, relativeY], index) => {

            const x =
                pitchX +
                (drawWidth * relativeX);

            const y =
                pitchY +
                (drawHeight * relativeY);

            drawPlayer(
                ctx,
                x,
                y,
                index
            );
        }
    );
}


// ====================================================
// BUTTON
// ====================================================

document
    .getElementById("generateButton")
    .addEventListener(
        "click",
        generateGraphic
    );


// ====================================================
// INITIALISE
// ====================================================

buildPlayerInputs();

pitchImage.onload = () => {
    generateGraphic();
};

if (pitchImage.complete) {
    generateGraphic();
}
