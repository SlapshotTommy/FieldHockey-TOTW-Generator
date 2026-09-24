// ====================================================
// SAINTFIELD HOCKEY CLUB
// TEAM OF THE WEEK GENERATOR
// ====================================================


// ====================================================
// POSITIONS
// ====================================================

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


// ====================================================
// SAMPLE DATA
// ====================================================

const samplePlayers = [
    ["Goalkeeper One", "Mens 1s", "Clean Sheet | POTM"],
    ["Defender One", "Ladies 1s", "POTM | 3-1 Win"],
    ["Defender Two", "Mens 2s", "1 Goal | 4-2 Win"],
    ["Defender Three", "Ladies 2s", "Clean Sheet | POTM"],
    ["Defender Four", "Mens 3s", "2 Goals | 3-0 Win"],
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

    const container =
        document.getElementById("players");


    positions.forEach((position, index) => {

        const player =
            samplePlayers[index];


        const div =
            document.createElement("div");

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
// ROUNDED RECTANGLE HELPER
// ====================================================

function roundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

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


// ====================================================
// DRAW PLAYER
// ====================================================

function drawPlayer(
    ctx,
    x,
    y,
    index
) {

    // ------------------------------------------------
    // READ PLAYER DATA
    // ------------------------------------------------

    const name =
        document
            .getElementById(`name-${index}`)
            .value
            .trim();


    const reasonText =
        document
            .getElementById(`reason-${index}`)
            .value
            .trim();


    // Split:
    //
    // 2 Goals | POTM | 4-1 Win
    //
    // into:
    //
    // 2 Goals
    // POTM
    // 4-1 Win

    const reasons =
        reasonText
            .split("|")
            .map(reason => reason.trim())
            .filter(Boolean);


    // =================================================
    // PLAYER CIRCLE
    // =================================================

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        29,
        0,
        Math.PI * 2
    );


    // Navy centre

    ctx.fillStyle = "#202133";
    ctx.fill();


    // White ring

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();


    // =================================================
    // PLAYER NUMBER
    // =================================================

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 21px Arial";


    ctx.fillText(
        index + 1,
        x,
        y + 1
    );


    // =================================================
    // PLAYER NAME
    // =================================================

    const nameY =
        y + 46;


    ctx.font =
        "bold 17px Arial";


    const nameWidth =
        Math.max(
            125,
            ctx.measureText(
                name.toUpperCase()
            ).width + 20
        );


    // Name background

    ctx.fillStyle =
        "rgba(32, 33, 51, 0.96)";


    roundedRect(
        ctx,
        x - nameWidth / 2,
        nameY - 15,
        nameWidth,
        30,
        7
    );


    // Name text

    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        name.toUpperCase(),
        x,
        nameY
    );


    // =================================================
    // PERFORMANCE REASONS
    // =================================================

    let reasonY =
        nameY + 27;


    ctx.font =
        "bold 15px Arial";


    reasons.forEach(reason => {

        const reasonWidth =
            Math.max(
                100,
                ctx.measureText(reason).width + 20
            );


        // Reason bubble

        ctx.fillStyle =
            "rgba(32, 33, 51, 0.92)";


        roundedRect(
            ctx,
            x - reasonWidth / 2,
            reasonY - 12,
            reasonWidth,
            24,
            6
        );


        // Reason text

        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            reason,
            x,
            reasonY
        );


        // Move down for next reason

        reasonY += 26;
    });
}


// ====================================================
// GENERATE GRAPHIC
// ====================================================

function generateGraphic() {

    const canvas =
        document.getElementById(
            "totwCanvas"
        );


    const ctx =
        canvas.getContext("2d");


    // =================================================
    // CLEAR CANVAS
    // =================================================

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =================================================
    // NAVY BACKGROUND
    // =================================================

    ctx.fillStyle =
        "#202133";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =================================================
    // HEADER
    // =================================================

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "alphabetic";


    // Club name

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 52px Arial";


    ctx.fillText(
        "SAINTFIELD HOCKEY CLUB",
        canvas.width / 2,
        65
    );


    // Team of the Week

    ctx.fillStyle =
        "#f2cf44";


    ctx.font =
        "bold 42px Arial";


    ctx.fillText(
        "TEAM OF THE WEEK",
        canvas.width / 2,
        118
    );


    // =================================================
    // SEASON / WEEKEND
    // =================================================

    const season =
        document
            .getElementById("season")
            .value;


    const weekend =
        document
            .getElementById("weekend")
            .value;


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "23px Arial";


    ctx.fillText(
        `${season}  •  ${weekend}`,
        canvas.width / 2,
        158
    );


    // =================================================
    // WAIT FOR PITCH IMAGE
    // =================================================

    if (
        !pitchImage.complete ||
        pitchImage.naturalWidth === 0
    ) {

        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "24px Arial";


        ctx.fillText(
            "Loading pitch...",
            canvas.width / 2,
            canvas.height / 2
        );


        return;
    }


    // =================================================
    // AVAILABLE PITCH AREA
    // =================================================

    const areaX = 25;

    const areaY = 185;


    const areaWidth =
        canvas.width - 50;


    const areaHeight =
        canvas.height -
        areaY -
        25;


    // =================================================
    // PRESERVE IMAGE ASPECT RATIO
    // =================================================

    const imageRatio =
        pitchImage.naturalWidth /
        pitchImage.naturalHeight;


    const areaRatio =
        areaWidth /
        areaHeight;


    let drawWidth;
    let drawHeight;


    if (imageRatio > areaRatio) {

        drawWidth =
            areaWidth;


        drawHeight =
            drawWidth /
            imageRatio;

    } else {

        drawHeight =
            areaHeight;


        drawWidth =
            drawHeight *
            imageRatio;
    }


    // =================================================
    // CENTRE PITCH
    // =================================================

    const pitchX =
        (
            canvas.width -
            drawWidth
        ) / 2;


    const pitchY =
        areaY +
        (
            areaHeight -
            drawHeight
        ) / 2;


    // =================================================
    // DRAW PITCH
    // =================================================

    ctx.drawImage(
        pitchImage,
        pitchX,
        pitchY,
        drawWidth,
        drawHeight
    );


    // =================================================
    // 1-4-3-3 FORMATION
    //
    // Coordinates are percentages of the pitch image.
    //
    // Lower Y = further up the pitch.
    // Higher Y = further down the pitch.
    //
    // Team attacks towards the TOP goal.
    // =================================================

    const formation = [

        // =============================================
        // GOALKEEPER
        // =============================================

        [0.50, 0.82],


        // =============================================
        // DEFENDERS
        //
        // Outside defenders push slightly higher.
        //
        // Central defenders sit deeper.
        // =============================================
        
        [0.28, 0.61],     // Defender 1 - moved right
        
        [0.39, 0.69],     // Defender 2
        
        [0.61, 0.69],     // Defender 3
        
        [0.72, 0.61],     // Defender 4 - moved left


        // =============================================
        // MIDFIELDERS
        // =============================================

        [0.27, 0.41],     // Midfielder 1

        [0.50, 0.41],     // Midfielder 2

        [0.73, 0.41],     // Midfielder 3


        // =============================================
        // FORWARDS
        //
        // Centre forward leads the line.
        //
        // Outside forwards sit slightly deeper.
        // =============================================

        [0.27, 0.21],     // Forward 1

        [0.50, 0.17],     // Forward 2

        [0.73, 0.21]      // Forward 3
    ];


    // =================================================
    // DRAW ALL PLAYERS
    // =================================================

    formation.forEach(
        ([relativeX, relativeY], index) => {

            const x =
                pitchX +
                (
                    drawWidth *
                    relativeX
                );


            const y =
                pitchY +
                (
                    drawHeight *
                    relativeY
                );


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
// GENERATE BUTTON
// ====================================================

document
    .getElementById(
        "generateButton"
    )
    .addEventListener(
        "click",
        generateGraphic
    );


// ====================================================
// INITIALISE
// ====================================================

buildPlayerInputs();


// Generate once pitch has loaded

pitchImage.onload = () => {

    generateGraphic();

};


// If browser already cached the pitch,
// generate immediately.

if (pitchImage.complete) {

    generateGraphic();

}
