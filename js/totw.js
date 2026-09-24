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

const pitchImage = new Image();
pitchImage.src = "./Pitch.png";

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


// ----------------------------------------------------
// Rounded rectangle helper
// ----------------------------------------------------

function roundedRect(ctx, x, y, width, height, radius) {

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        width,
        height,
        radius
    );

    ctx.fill();
}


// ----------------------------------------------------
// Draw an individual player
// ----------------------------------------------------

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


    // -------------------------
    // Player marker
    // -------------------------

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);

    ctx.fillStyle = "#202133";
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f2cf44";
    ctx.stroke();


    // -------------------------
    // Position number
    // -------------------------

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 22px Arial";

    ctx.fillText(
        index + 1,
        x,
        y + 1
    );


    // -------------------------
    // Player name
    // -------------------------

    const nameY = y + 48;

    ctx.font = "bold 22px Arial";

    const nameWidth =
        Math.max(
            150,
            ctx.measureText(name).width + 28
        );

    ctx.fillStyle = "rgba(32,33,51,0.95)";

    roundedRect(
        ctx,
        x - nameWidth / 2,
        nameY - 18,
        nameWidth,
        36,
        9
    );

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        name.toUpperCase(),
        x,
        nameY
    );


    // -------------------------
    // Squad
    // -------------------------

    const squadY = nameY + 32;

    ctx.font = "bold 17px Arial";

    const squadWidth =
        Math.max(
            90,
            ctx.measureText(squad).width + 24
        );

    ctx.fillStyle = "#f2cf44";

    roundedRect(
        ctx,
        x - squadWidth / 2,
        squadY - 14,
        squadWidth,
        28,
        7
    );

    ctx.fillStyle = "#202133";

    ctx.fillText(
        squad,
        x,
        squadY
    );


    // -------------------------
    // Performance reasons
    // -------------------------

    let reasonY = squadY + 30;

    ctx.font = "bold 16px Arial";

    reasons.forEach(reason => {

        const reasonWidth =
            Math.max(
                105,
                ctx.measureText(reason).width + 22
            );

        ctx.fillStyle =
            "rgba(32,33,51,0.90)";

        roundedRect(
            ctx,
            x - reasonWidth / 2,
            reasonY - 13,
            reasonWidth,
            26,
            6
        );

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            reason,
            x,
            reasonY
        );

        reasonY += 28;
    });
}


// ----------------------------------------------------
// Main graphic generator
// ----------------------------------------------------

function generateGraphic() {

    const canvas =
        document.getElementById("totwCanvas");

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ------------------------------------------------
    // Main navy background
    // ------------------------------------------------

    ctx.fillStyle = "#202133";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ------------------------------------------------
    // Header
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
    // Pitch
    // ------------------------------------------------

    if (!pitchImage.complete ||
        pitchImage.naturalWidth === 0) {

        ctx.font = "24px Arial";
        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            "Loading pitch...",
            canvas.width / 2,
            canvas.height / 2
        );

        return;
    }


    /*
        Available area for the pitch.
        We calculate the image size rather than stretching it.
    */

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

        drawHeight =
            drawWidth / imageRatio;

    } else {

        drawHeight = areaHeight;

        drawWidth =
            drawHeight * imageRatio;
    }


    const pitchX =
        (canvas.width - drawWidth) / 2;

    const pitchY =
        areaY +
        (areaHeight - drawHeight) / 2;


    ctx.drawImage(
        pitchImage,
        pitchX,
        pitchY,
        drawWidth,
        drawHeight
    );


    // ------------------------------------------------
    // Player formation
    //
    // Values are percentages of the displayed image.
    // This makes the formation move with the pitch.
    // ------------------------------------------------

    const formation = [

        // Goalkeeper
        [0.50, 0.82],

        // Defenders
        [0.20, 0.66],
        [0.40, 0.66],
        [0.60, 0.66],
        [0.80, 0.66],

        // Midfield
        [0.27, 0.44],
        [0.50, 0.44],
        [0.73, 0.44],

        // Forwards
        [0.27, 0.20],
        [0.50, 0.20],
        [0.73, 0.20]
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


// ----------------------------------------------------
// Start
// ----------------------------------------------------

buildPlayerInputs();

pitchImage.onload = () => {
    generateGraphic();
};

if (pitchImage.complete) {
    generateGraphic();
}
