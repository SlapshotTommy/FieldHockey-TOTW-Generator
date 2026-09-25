/* =========================================================
   SAINTFIELD HOCKEY CLUB
   TEAM OF THE WEEK GENERATOR
   ========================================================= */


/* =========================================================
   FORMATION
   ========================================================= */

const positions = [
    [0.50, 0.82], // GK

    [0.23, 0.61], // LB
    [0.39, 0.69], // CB
    [0.61, 0.69], // CB
    [0.77, 0.61], // RB

    [0.27, 0.41], // LM
    [0.50, 0.41], // CM
    [0.73, 0.41], // RM

    [0.27, 0.21], // LW
    [0.50, 0.17], // CF
    [0.73, 0.21]  // RW
];


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


/* =========================================================
   EXCEL POSITION MAPPING
   ========================================================= */

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


/* =========================================================
   SAMPLE DATA
   ========================================================= */

const samplePlayers = [

    {
        name: "Goalkeeper",
        squad: "Ladies 1s",
        reason: "Clean Sheet"
    },

    {
        name: "Left Back",
        squad: "Ladies 1s",
        reason: "Strong Defensive Display"
    },

    {
        name: "Centre Back",
        squad: "Ladies 1s",
        reason: "Clean Sheet"
    },

    {
        name: "Centre Back",
        squad: "Ladies 1s",
        reason: "POTG"
    },

    {
        name: "Right Back",
        squad: "Ladies 1s",
        reason: "Strong Defensive Display"
    },

    {
        name: "Left Midfield",
        squad: "Ladies 1s",
        reason: "Goal"
    },

    {
        name: "Centre Midfield",
        squad: "Mens 1s",
        reason: "POTG"
    },

    {
        name: "Right Midfield",
        squad: "Ladies 2s",
        reason: "Goal"
    },

    {
        name: "Left Wing",
        squad: "Ladies 1s",
        reason: "Goal"
    },

    {
        name: "Centre Forward",
        squad: "Mens 1s",
        reason: "2 Goals"
    },

    {
        name: "Right Wing",
        squad: "Ladies 1s",
        reason: "Goal"
    }

];


/* =========================================================
   GLOBALS
   ========================================================= */

const canvas =
    document.getElementById("totwCanvas");

const ctx =
    canvas.getContext("2d");


/* ---------------------------------------------------------
   BACKGROUND IMAGE
   --------------------------------------------------------- */

const backgroundImage =
    new Image();

backgroundImage.src =
    "./assets/bg.png";


/* ---------------------------------------------------------
   PITCH IMAGE
   --------------------------------------------------------- */

const pitchImage =
    new Image();

pitchImage.src =
    "./assets/Pitch.png";


let selectedSwapIndex = null;


/* =========================================================
   CLEAN TEXT
   ========================================================= */

function cleanText(value) {

    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");

}


/* =========================================================
   DRAW IMAGE USING "COVER"
   ========================================================= */

function drawImageCover(
    context,
    image,
    x,
    y,
    width,
    height
) {

    const imageRatio =
        image.naturalWidth /
        image.naturalHeight;

    const targetRatio =
        width /
        height;


    let sourceWidth =
        image.naturalWidth;

    let sourceHeight =
        image.naturalHeight;

    let sourceX = 0;

    let sourceY = 0;


    /*
        Image is wider than target.
        Crop left and right.
    */

    if (imageRatio > targetRatio) {

        sourceWidth =
            image.naturalHeight *
            targetRatio;

        sourceX =
            (
                image.naturalWidth -
                sourceWidth
            ) / 2;

    }

    /*
        Image is taller than target.
        Crop top and bottom.
    */

    else {

        sourceHeight =
            image.naturalWidth /
            targetRatio;

        sourceY =
            (
                image.naturalHeight -
                sourceHeight
            ) / 2;

    }


    context.drawImage(
        image,

        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,

        x,
        y,
        width,
        height
    );

}


/* =========================================================
   BUILD PLAYER INPUTS
   ========================================================= */

function buildPlayerInputs() {

    const container =
        document.getElementById(
            "players"
        );


    container.innerHTML = "";


    samplePlayers.forEach(
        (player, index) => {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "player";

            wrapper.dataset.index =
                index;


            wrapper.innerHTML = `

                <div class="player-title">
                    ${positionLabels[index]}
                </div>

                <div class="player-row">

                    <input
                        class="player-name"
                        type="text"
                        value="${player.name}"
                        placeholder="Player name"
                    >

                    <input
                        class="player-squad"
                        type="text"
                        value="${player.squad}"
                        placeholder="Squad"
                    >

                </div>

                <input
                    class="player-reason reason"
                    type="text"
                    value="${player.reason}"
                    placeholder="Reason"
                >

                <div class="player-actions">

                    <button
                        class="swap-button"
                        type="button"
                        data-index="${index}">
                        Swap ${positionLabels[index]}
                    </button>

                </div>

            `;


            container.appendChild(
                wrapper
            );

        }
    );


    /* -----------------------------------------------------
       SWAP BUTTON LISTENERS
       ----------------------------------------------------- */

    document
        .querySelectorAll(
            ".swap-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button
                                    .dataset
                                    .index
                            );


                        handleSwap(
                            index
                        );

                    }
                );

            }
        );


    /* -----------------------------------------------------
       LIVE PLAYER EDITING
       ----------------------------------------------------- */

    document
        .querySelectorAll(
            ".player-name, .player-reason"
        )
        .forEach(
            input => {

                input.addEventListener(
                    "input",
                    generateGraphic
                );

            }
        );

}


/* =========================================================
   PLAYER SWAPPING
   ========================================================= */

function handleSwap(index) {

    const playerCards =
        document.querySelectorAll(
            ".player"
        );


    /*
        FIRST PLAYER SELECTED
    */

    if (
        selectedSwapIndex === null
    ) {

        selectedSwapIndex =
            index;


        playerCards[index]
            .classList
            .add(
                "swap-selected"
            );


        return;

    }


    /*
        CLICKING SAME PLAYER CANCELS
    */

    if (
        selectedSwapIndex === index
    ) {

        playerCards[index]
            .classList
            .remove(
                "swap-selected"
            );


        selectedSwapIndex =
            null;


        return;

    }


    /*
        SWAP THE TWO PLAYERS
    */

    const first =
        playerCards[
            selectedSwapIndex
        ];

    const second =
        playerCards[index];


    const firstName =
        first
            .querySelector(
                ".player-name"
            )
            .value;


    const firstSquad =
        first
            .querySelector(
                ".player-squad"
            )
            .value;


    const firstReason =
        first
            .querySelector(
                ".player-reason"
            )
            .value;


    first
        .querySelector(
            ".player-name"
        )
        .value =
        second
            .querySelector(
                ".player-name"
            )
            .value;


    first
        .querySelector(
            ".player-squad"
        )
        .value =
        second
            .querySelector(
                ".player-squad"
            )
            .value;


    first
        .querySelector(
            ".player-reason"
        )
        .value =
        second
            .querySelector(
                ".player-reason"
            )
            .value;


    second
        .querySelector(
            ".player-name"
        )
        .value =
        firstName;


    second
        .querySelector(
            ".player-squad"
        )
        .value =
        firstSquad;


    second
        .querySelector(
            ".player-reason"
        )
        .value =
        firstReason;


    playerCards[
        selectedSwapIndex
    ]
        .classList
        .remove(
            "swap-selected"
        );


    selectedSwapIndex =
        null;


    generateGraphic();

}


/* =========================================================
   IMPORT STATUS
   ========================================================= */

function setImportStatus(
    message,
    type = ""
) {

    const status =
        document.getElementById(
            "importStatus"
        );


    status.textContent =
        message;


    status.className =
        "import-status";


    if (type) {

        status
            .classList
            .add(type);

    }

}


/* =========================================================
   IMPORT FROM EXCEL / POWER QUERY
   ========================================================= */

function importFromExcel() {

    const importBox =
        document.getElementById(
            "excelImport"
        );


    const rawText =
        importBox
            .value
            .trim();


    if (!rawText) {

        setImportStatus(
            "Paste the Excel Team of the Week table first.",
            "error"
        );

        return;

    }


    let rows =
        rawText
            .split(/\r?\n/)
            .filter(
                row =>
                    row.trim() !== ""
            )
            .map(
                row =>
                    row.split("\t")
            );


    if (
        rows.length === 0
    ) {

        setImportStatus(
            "No rows were found.",
            "error"
        );

        return;

    }


    /* -----------------------------------------------------
       REMOVE HEADER ROW IF PRESENT
       ----------------------------------------------------- */

    const firstRow =
        rows[0]
            .map(cleanText)
            .map(
                value =>
                    value.toLowerCase()
            );


    const looksLikeHeader =
        firstRow.includes(
            "season"
        ) &&
        firstRow.includes(
            "weekend"
        ) &&
        firstRow.includes(
            "totw position"
        ) &&
        firstRow.includes(
            "player"
        ) &&
        firstRow.includes(
            "squad"
        ) &&
        firstRow.includes(
            "reason"
        );


    if (looksLikeHeader) {

        rows.shift();

    }


    /* -----------------------------------------------------
       VALIDATE NUMBER OF PLAYERS
       ----------------------------------------------------- */

    if (
        rows.length !== 11
    ) {

        setImportStatus(
            `Expected 11 players but found ${rows.length}.`,
            "error"
        );

        return;

    }


    const importedPlayers =
        new Array(11)
            .fill(null);


    let importedSeason = "";

    let importedWeekend = "";


    /* -----------------------------------------------------
       READ ROWS
       ----------------------------------------------------- */

    for (
        let rowNumber = 0;
        rowNumber < rows.length;
        rowNumber++
    ) {

        const row =
            rows[rowNumber];


        if (
            row.length < 6
        ) {

            setImportStatus(
                `Row ${rowNumber + 1} does not contain all 6 required columns.`,
                "error"
            );

            return;

        }


        const season =
            cleanText(
                row[0]
            );


        const weekend =
            cleanText(
                row[1]
            );


        const totwPosition =
            cleanText(
                row[2]
            )
                .toLowerCase();


        const player =
            cleanText(
                row[3]
            );


        const squad =
            cleanText(
                row[4]
            );


        const reason =
            cleanText(
                row
                    .slice(5)
                    .join(" ")
            );


        if (
            !(
                totwPosition
                in importPositionMap
            )
        ) {

            setImportStatus(
                `Unknown TOTW Position: ${row[2]}`,
                "error"
            );

            return;

        }


        const playerIndex =
            importPositionMap[
                totwPosition
            ];


        if (
            importedPlayers[
                playerIndex
            ] !== null
        ) {

            setImportStatus(
                `Duplicate TOTW Position: ${row[2]}`,
                "error"
            );

            return;

        }


        importedPlayers[
            playerIndex
        ] = {

            name: player,

            squad: squad,

            reason: reason

        };


        if (
            !importedSeason
        ) {

            importedSeason =
                season;

        }


        if (
            !importedWeekend
        ) {

            importedWeekend =
                weekend;

        }

    }


    /* -----------------------------------------------------
       CHECK ALL POSITIONS EXIST
       ----------------------------------------------------- */

    const missingPositions = [];


    Object
        .entries(
            importPositionMap
        )
        .forEach(
            (
                [
                    positionName,
                    index
                ]
            ) => {

                if (
                    !importedPlayers[
                        index
                    ]
                ) {

                    missingPositions
                        .push(
                            positionName
                        );

                }

            }
        );


    if (
        missingPositions.length > 0
    ) {

        setImportStatus(
            `Missing positions: ${missingPositions.join(", ")}`,
            "error"
        );

        return;

    }


    /* -----------------------------------------------------
       WRITE TEAM DETAILS
       ----------------------------------------------------- */

    document
        .getElementById(
            "season"
        )
        .value =
        importedSeason;


    document
        .getElementById(
            "weekend"
        )
        .value =
        importedWeekend;


    /* -----------------------------------------------------
       WRITE PLAYER DETAILS
       ----------------------------------------------------- */

    const playerCards =
        document.querySelectorAll(
            ".player"
        );


    importedPlayers
        .forEach(
            (
                player,
                index
            ) => {

                const card =
                    playerCards[
                        index
                    ];


                card
                    .querySelector(
                        ".player-name"
                    )
                    .value =
                    player.name;


                card
                    .querySelector(
                        ".player-squad"
                    )
                    .value =
                    player.squad;


                card
                    .querySelector(
                        ".player-reason"
                    )
                    .value =
                    player.reason;

            }
        );


    selectedSwapIndex =
        null;


    playerCards.forEach(
        card =>
            card
                .classList
                .remove(
                    "swap-selected"
                )
    );


    setImportStatus(
        "Team of the Week imported successfully.",
        "success"
    );


    /*
        Redraw immediately after import.

        This does NOT wait for the asset-loading
        function, so Import XI remains responsive.
    */

    generateGraphic();

}


/* =========================================================
   ROUNDED RECTANGLE
   ========================================================= */

function roundedRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {

    const r =
        Math.min(
            radius,
            width / 2,
            height / 2
        );


    context.beginPath();


    context.moveTo(
        x + r,
        y
    );


    context.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        r
    );


    context.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        r
    );


    context.arcTo(
        x,
        y + height,
        x,
        y,
        r
    );


    context.arcTo(
        x,
        y,
        x + width,
        y,
        r
    );


    context.closePath();

}


/* =========================================================
   DRAW PLAYER
   ========================================================= */

function drawPlayer(
    x,
    y,
    position,
    name,
    reason
) {

    const navy =
        "#202133";

    const white =
        "#ffffff";


    /* -----------------------------------------------------
       POSITION CIRCLE
       ----------------------------------------------------- */

    ctx.beginPath();


    ctx.arc(
        x,
        y,
        31,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        navy;


    ctx.fill();


    ctx.lineWidth =
        4;


    ctx.strokeStyle =
        white;


    ctx.stroke();


    /* -----------------------------------------------------
       POSITION TEXT
       ----------------------------------------------------- */

    ctx.fillStyle =
        white;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    if (
        position === "SWEEP"
    ) {

        ctx.font =
            "800 17px 'Barlow Condensed', Arial, sans-serif";

    }

    else {

        ctx.font =
            "800 24px 'Barlow Condensed', Arial, sans-serif";

    }


    ctx.fillText(
        position,
        x,
        y + 1
    );


    /* -----------------------------------------------------
       PLAYER NAME
       ----------------------------------------------------- */

    ctx.font =
        "800 17px 'Barlow Condensed', Arial, sans-serif";


    const namePadding =
        12;


    const nameWidth =
        Math.max(
            92,
            ctx
                .measureText(
                    name
                )
                .width +
            (
                namePadding *
                2
            )
        );


    const nameHeight =
        28;


    const nameX =
        x -
        (
            nameWidth /
            2
        );


    const nameY =
        y + 37;


    roundedRect(
        ctx,
        nameX,
        nameY,
        nameWidth,
        nameHeight,
        6
    );


    ctx.fillStyle =
        navy;


    ctx.fill();


    ctx.fillStyle =
        white;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        name,
        x,
        nameY +
        (
            nameHeight /
            2
        )
    );


    /* -----------------------------------------------------
       REASONS
       ----------------------------------------------------- */

    const reasons =
        reason
            .split("|")
            .map(
                item =>
                    item.trim()
            )
            .filter(
                Boolean
            );


    let reasonY =
        nameY +
        nameHeight +
        5;


    ctx.font =
        "600 17px 'Barlow Condensed', Arial, sans-serif";


    reasons.forEach(
        reasonText => {

            const reasonPadding =
                11;


            const reasonWidth =
                Math.max(
                    70,
                    ctx
                        .measureText(
                            reasonText
                        )
                        .width +
                    (
                        reasonPadding *
                        2
                    )
                );


            const reasonHeight =
                25;


            const reasonX =
                x -
                (
                    reasonWidth /
                    2
                );


            roundedRect(
                ctx,
                reasonX,
                reasonY,
                reasonWidth,
                reasonHeight,
                6
            );


            ctx.fillStyle =
                navy;


            ctx.fill();


            ctx.fillStyle =
                white;


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            ctx.fillText(
                reasonText,
                x,
                reasonY +
                (
                    reasonHeight /
                    2
                )
            );


            reasonY +=
                reasonHeight +
                4;

        }
    );

}


/* =========================================================
   GENERATE GRAPHIC
   ========================================================= */

function generateGraphic() {

    const width =
        canvas.width;

    const height =
        canvas.height;


    const navy =
        "#202133";

    const yellow =
        "#f2cf44";

    const white =
        "#ffffff";


    /* -----------------------------------------------------
       CLEAR CANVAS
       ----------------------------------------------------- */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* -----------------------------------------------------
       BACKGROUND IMAGE
       ----------------------------------------------------- */

    if (
        backgroundImage.complete &&
        backgroundImage.naturalWidth > 0
    ) {

        drawImageCover(
            ctx,
            backgroundImage,
            0,
            0,
            width,
            height
        );

    }

    else {

        /*
            Fallback to Saintfield navy if
            bg.png isn't ready.
        */

        ctx.fillStyle =
            navy;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );

    }


    /* -----------------------------------------------------
       HEADER
       ----------------------------------------------------- */

    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillStyle =
        white;


    ctx.font =
        "700 42px 'Barlow Condensed', Arial, sans-serif";


    ctx.fillText(
        "SAINTFIELD HOCKEY CLUB",
        width / 2,
        42
    );


    ctx.fillStyle =
        yellow;


    ctx.font =
        "900 58px 'Barlow Condensed', Arial, sans-serif";


    ctx.fillText(
        "TEAM OF THE WEEK",
        width / 2,
        91
    );


    const season =
        document
            .getElementById(
                "season"
            )
            .value
            .trim();


    const weekend =
        document
            .getElementById(
                "weekend"
            )
            .value
            .trim();


    ctx.fillStyle =
        white;


    ctx.font =
        "500 26px 'Barlow Condensed', Arial, sans-serif";


    ctx.fillText(
        `${season}  •  ${weekend}`,
        width / 2,
        132
    );


    /* -----------------------------------------------------
       PITCH OVERLAY
       ----------------------------------------------------- */

    const pitchX =
        40;

    const pitchY =
        165;

    const pitchWidth =
        1000;

    const pitchHeight =
        1145;


    if (
        pitchImage.complete &&
        pitchImage.naturalWidth > 0
    ) {

        ctx.drawImage(
            pitchImage,
            pitchX,
            pitchY,
            pitchWidth,
            pitchHeight
        );

    }


    /* -----------------------------------------------------
       PLAYERS
       ----------------------------------------------------- */

    const playerCards =
        document.querySelectorAll(
            ".player"
        );


    playerCards.forEach(
        (
            card,
            index
        ) => {

            const name =
                cleanText(
                    card
                        .querySelector(
                            ".player-name"
                        )
                        .value
                );


            const reason =
                cleanText(
                    card
                        .querySelector(
                            ".player-reason"
                        )
                        .value
                );


            const [
                relativeX,
                relativeY
            ] =
                positions[index];


            const x =
                pitchX +
                (
                    relativeX *
                    pitchWidth
                );


            const y =
                pitchY +
                (
                    relativeY *
                    pitchHeight
                );


            drawPlayer(
                x,
                y,
                positionLabels[index],
                name,
                reason
            );

        }
    );

}


/* =========================================================
   WAIT FOR GRAPHIC ASSETS
   ========================================================= */

async function waitForGraphicAssets() {

    /*
        Wait for Barlow Condensed.
    */

    await document.fonts.ready;


    const imagePromises = [];


    /*
        Wait for background image if it is
        still actively loading.
    */

    if (
        !backgroundImage.complete
    ) {

        imagePromises.push(

            new Promise(
                resolve => {

                    backgroundImage.addEventListener(
                        "load",
                        resolve,
                        { once: true }
                    );

                    backgroundImage.addEventListener(
                        "error",
                        resolve,
                        { once: true }
                    );

                }
            )

        );

    }


    /*
        Wait for pitch image if it is
        still actively loading.
    */

    if (
        !pitchImage.complete
    ) {

        imagePromises.push(

            new Promise(
                resolve => {

                    pitchImage.addEventListener(
                        "load",
                        resolve,
                        { once: true }
                    );

                    pitchImage.addEventListener(
                        "error",
                        resolve,
                        { once: true }
                    );

                }
            )

        );

    }


    if (
        imagePromises.length > 0
    ) {

        await Promise.all(
            imagePromises
        );

    }

}


/* =========================================================
   DOWNLOAD PNG
   ========================================================= */

async function downloadGraphic() {

    /*
        For download we DO want to wait
        for all graphic assets.
    */

    await waitForGraphicAssets();


    /*
        Final redraw immediately before
        exporting the PNG.
    */

    generateGraphic();


    const season =
        document
            .getElementById(
                "season"
            )
            .value
            .trim()
            .replace(
                /[\/\\]/g,
                "-"
            )
            .replace(
                /\s+/g,
                "-"
            );


    const weekend =
        document
            .getElementById(
                "weekend"
            )
            .value
            .trim()
            .replace(
                /[\/\\]/g,
                "-"
            )
            .replace(
                /\s+/g,
                "-"
            );


    const link =
        document.createElement(
            "a"
        );


    link.download =
        `Saintfield-TOTW-${season}-${weekend}.png`;


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    document.body
        .appendChild(
            link
        );


    link.click();


    document.body
        .removeChild(
            link
        );

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */


/* ---------------------------------------------------------
   DOWNLOAD PNG
   --------------------------------------------------------- */

document
    .getElementById(
        "downloadButton"
    )
    .addEventListener(
        "click",
        downloadGraphic
    );


/* ---------------------------------------------------------
   EXCEL IMPORT

   IMPORTANT:
   Import does NOT wait for graphic assets.
   It should respond immediately when clicked.
   --------------------------------------------------------- */

document
    .getElementById(
        "importButton"
    )
    .addEventListener(
        "click",
        importFromExcel
    );


/* ---------------------------------------------------------
   LIVE SEASON UPDATE
   --------------------------------------------------------- */

document
    .getElementById(
        "season"
    )
    .addEventListener(
        "input",
        generateGraphic
    );


/* ---------------------------------------------------------
   LIVE WEEKEND UPDATE
   --------------------------------------------------------- */

document
    .getElementById(
        "weekend"
    )
    .addEventListener(
        "input",
        generateGraphic
    );


/* =========================================================
   INITIALISE
   ========================================================= */

buildPlayerInputs();


/*
    Draw once the font and images are ready.
*/

waitForGraphicAssets()
    .then(
        () => {

            generateGraphic();

        }
    );
