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
// POSITION LABELS
// ====================================================

const positionLabels = [
    "GK",
    "LB",
    "CB",
    "CB",
    "RB",
    "LM",
    "CM",
    "RM",
    "LW",
    "CF",
    "RW"
];


// ====================================================
// POWER QUERY POSITION MAPPING
//
// Maps TOTW Position from Excel to the correct
// slot in the website.
// ====================================================

const importPositionMap = {
    "goalie": 0,
    "defence 1": 1,
    "defence 2": 2,
    "defence 3": 3,
    "defence 4": 4,
    "midfield 1": 5,
    "midfield 2": 6,
    "midfield 3": 7,
    "forward 1": 8,
    "forward 2": 9,
    "forward 3": 10
};


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
// SWAP STATE
// ====================================================

let selectedSwapIndex = null;


// ====================================================
// CLEAN IMPORTED TEXT
// ====================================================

function cleanText(value) {

    return String(value || "")
        .replace(/\s+/g, " ")
        .trim();
}


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
        div.id = `player-${index}`;


        div.innerHTML = `

            <div class="player-title">
                ${positionLabels[index]} - ${position}
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

            <div class="player-actions">

                <button
                    class="swap-button"
                    type="button"
                    data-index="${index}">

                    Swap ${positionLabels[index]}

                </button>

            </div>

        `;


        container.appendChild(div);
    });


    // Attach swap events after all players exist.

    document
        .querySelectorAll(".swap-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(button.dataset.index);

                    handleSwap(index);
                }
            );
        });
}


// ====================================================
// SWAP PLAYERS
// ====================================================

function handleSwap(index) {

    // No player selected yet:
    // select the first player.

    if (selectedSwapIndex === null) {

        selectedSwapIndex = index;


        document
            .getElementById(`player-${index}`)
            .classList
            .add("swap-selected");


        setImportStatus(
            `Selected ${positionLabels[index]}. Choose another player to swap with.`,
            "success"
        );


        return;
    }


    // Clicking the same player again cancels the swap.

    if (selectedSwapIndex === index) {

        document
            .getElementById(`player-${index}`)
            .classList
            .remove("swap-selected");


        selectedSwapIndex = null;


        setImportStatus(
            "Swap cancelled.",
            ""
        );


        return;
    }


    const firstIndex =
        selectedSwapIndex;


    const secondIndex =
        index;


    // ------------------------------------------------
    // READ FIRST PLAYER
    // ------------------------------------------------

    const firstPlayer = {
        name:
            document
                .getElementById(`name-${firstIndex}`)
                .value,

        squad:
            document
                .getElementById(`squad-${firstIndex}`)
                .value,

        reason:
            document
                .getElementById(`reason-${firstIndex}`)
                .value
    };


    // ------------------------------------------------
    // READ SECOND PLAYER
    // ------------------------------------------------

    const secondPlayer = {
        name:
            document
                .getElementById(`name-${secondIndex}`)
                .value,

        squad:
            document
                .getElementById(`squad-${secondIndex}`)
                .value,

        reason:
            document
                .getElementById(`reason-${secondIndex}`)
                .value
    };


    // ------------------------------------------------
    // SWAP PLAYER DATA
    // ------------------------------------------------

    document
        .getElementById(`name-${firstIndex}`)
        .value = secondPlayer.name;


    document
        .getElementById(`squad-${firstIndex}`)
        .value = secondPlayer.squad;


    document
        .getElementById(`reason-${firstIndex}`)
        .value = secondPlayer.reason;


    document
        .getElementById(`name-${secondIndex}`)
        .value = firstPlayer.name;


    document
        .getElementById(`squad-${secondIndex}`)
        .value = firstPlayer.squad;


    document
        .getElementById(`reason-${secondIndex}`)
        .value = firstPlayer.reason;


    // ------------------------------------------------
    // CLEAR SELECTION
    // ------------------------------------------------

    document
        .getElementById(`player-${firstIndex}`)
        .classList
        .remove("swap-selected");


    selectedSwapIndex = null;


    // Regenerate graphic immediately.

    generateGraphic();


    setImportStatus(
        `${positionLabels[firstIndex]} and ${positionLabels[secondIndex]} swapped.`,
        "success"
    );
}


// ====================================================
// IMPORT STATUS
// ====================================================

function setImportStatus(message, type) {

    const status =
        document.getElementById("importStatus");


    status.textContent =
        message;


    status.className =
        "import-status";


    if (type) {

        status.classList.add(type);
    }
}


// ====================================================
// IMPORT FROM EXCEL
// ====================================================

function importFromExcel() {

    const importBox =
        document.getElementById("excelImport");


    const rawText =
        importBox.value.trim();


    if (!rawText) {

        setImportStatus(
            "Paste the Excel TOTW table first.",
            "error"
        );

        return;
    }


    // Excel copies columns separated by TAB
    // and rows separated by line breaks.

    let rows =
        rawText
            .split(/\r?\n/)
            .filter(row => row.trim() !== "")
            .map(row => row.split("\t"));


    if (rows.length === 0) {

        setImportStatus(
            "No rows were found in the pasted data.",
            "error"
        );

        return;
    }


    // =================================================
    // DETECT HEADER ROW
    // =================================================

    const firstRow =
        rows[0]
            .map(value =>
                cleanText(value).toLowerCase()
            );


    const hasHeader =
        firstRow.includes("season") &&
        firstRow.includes("weekend") &&
        firstRow.includes("totw position") &&
        firstRow.includes("player") &&
        firstRow.includes("squad") &&
        firstRow.includes("reason");


    if (hasHeader) {

        rows =
            rows.slice(1);
    }


    // =================================================
    // VALIDATE ROW COUNT
    // =================================================

    if (rows.length !== 11) {

        setImportStatus(
            `Expected 11 player rows but found ${rows.length}.`,
            "error"
        );

        return;
    }


    // =================================================
    // PROCESS IMPORT
    // =================================================

    const importedSlots =
        new Set();


    let importedSeason = "";
    let importedWeekend = "";


    for (const row of rows) {

        if (row.length < 6) {

            setImportStatus(
                "One or more Excel rows does not contain all 6 columns.",
                "error"
            );

            return;
        }


        const season =
            cleanText(row[0]);


        const weekend =
            cleanText(row[1]);


        const totwPosition =
            cleanText(row[2]);


        const player =
            cleanText(row[3]);


        const squad =
            cleanText(row[4]);


        const reason =
            cleanText(row.slice(5).join("\t"));


        const positionKey =
            totwPosition.toLowerCase();


        // Check position exists.

        if (
            !Object.prototype.hasOwnProperty.call(
                importPositionMap,
                positionKey
            )
        ) {

            setImportStatus(
                `Unknown TOTW Position: ${totwPosition}`,
                "error"
            );

            return;
        }


        const index =
            importPositionMap[positionKey];


        // Prevent duplicated slots.

        if (importedSlots.has(index)) {

            setImportStatus(
                `Duplicate TOTW Position: ${totwPosition}`,
                "error"
            );

            return;
        }


        importedSlots.add(index);


        // Capture season/weekend from first row.

        if (!importedSeason) {

            importedSeason =
                season;
        }


        if (!importedWeekend) {

            importedWeekend =
                weekend;
        }


        // Populate player.

        document
            .getElementById(`name-${index}`)
            .value = player;


        document
            .getElementById(`squad-${index}`)
            .value = squad;


        document
            .getElementById(`reason-${index}`)
            .value = reason;
    }


    // =================================================
    // FINAL VALIDATION
    // =================================================

    if (importedSlots.size !== 11) {

        setImportStatus(
            `Only ${importedSlots.size} unique positions were imported.`,
            "error"
        );

        return;
    }


    // =================================================
    // UPDATE TEAM DETAILS
    // =================================================

    document
        .getElementById("season")
        .value = importedSeason;


    document
        .getElementById("weekend")
        .value = importedWeekend;


    // Clear any unfinished swap selection.

    if (selectedSwapIndex !== null) {

        document
            .getElementById(
                `player-${selectedSwapIndex}`
            )
            .classList
            .remove("swap-selected");


        selectedSwapIndex = null;
    }


    // Regenerate immediately.

    generateGraphic();


    setImportStatus(
        "11 players imported successfully.",
        "success"
    );
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


    ctx.fillStyle =
        "#202133";

    ctx.fill();


    ctx.lineWidth =
        5;

    ctx.strokeStyle =
        "#ffffff";

    ctx.stroke();


    // =================================================
    // POSITION LABEL
    // =================================================

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        "#ffffff";


    if (positionLabels[index] === "SWEEP") {

        ctx.font =
            "bold 13px Arial";

    } else {

        ctx.font =
            "bold 18px Arial";
    }


    ctx.fillText(
        positionLabels[index],
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


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            reason,
            x,
            reasonY
        );


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


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 52px Arial";


    ctx.fillText(
        "SAINTFIELD HOCKEY CLUB",
        canvas.width / 2,
        65
    );


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

    const areaY =
        185;


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
    // =================================================

    const formation = [

        [0.50, 0.82],     // GK

        [0.23, 0.61],     // LB
        [0.39, 0.69],     // CB
        [0.61, 0.69],     // CB
        [0.77, 0.61],     // RB

        [0.27, 0.41],     // LM
        [0.50, 0.41],     // CM
        [0.73, 0.41],     // RM

        [0.27, 0.21],     // LW
        [0.50, 0.17],     // CF
        [0.73, 0.21]      // RW
    ];


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
// DOWNLOAD PNG
// ====================================================

function downloadGraphic() {

    generateGraphic();


    const canvas =
        document.getElementById(
            "totwCanvas"
        );


    const season =
        document
            .getElementById("season")
            .value
            .trim()
            .replace(/\//g, "-");


    const weekend =
        document
            .getElementById("weekend")
            .value
            .trim()
            .replace(/\//g, "-")
            .replace(/\s+/g, "-");


    const filename =
        `Saintfield-TOTW-${season}-${weekend}.png`;


    const image =
        canvas.toDataURL(
            "image/png"
        );


    const link =
        document.createElement("a");


    link.download =
        filename;


    link.href =
        image;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );
}


// ====================================================
// BUTTON EVENTS
// ====================================================

document
    .getElementById("generateButton")
    .addEventListener(
        "click",
        generateGraphic
    );


document
    .getElementById("downloadButton")
    .addEventListener(
        "click",
        downloadGraphic
    );


document
    .getElementById("importButton")
    .addEventListener(
        "click",
        importFromExcel
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
