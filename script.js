let fields = [null, null, null, null, null, null, null, null, null];
let currentShape = 'circle'; 

function init() {
    render();
}

function render() {
    let content = document.getElementById('content');
    let html = '<table class="ticTacToe">';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;

            html += `
                <td id="cell-${index}" onclick="handleClick(${index})"></td>
            `;
        }
        html += '</tr>';
    }

    html += '</table>';
    content.innerHTML = html;
}

function handleClick(index) {
    fields[index] = currentShape;
    let cell = document.getElementById('cell-' + index);

    if (currentShape === 'circle') {
        cell.innerHTML = generateCircleSVG();
    } else {
        cell.innerHTML = generateCrossSVG();
    }

    cell.removeAttribute('onclick');

    // 🔥 Nach jedem Zug prüfen, ob jemand gewonnen hat
    let winInfo = checkForWin();
    if (winInfo) {
        drawWinningLine(winInfo);
        disableAllClicks();
        return;
    }

    currentShape = currentShape === 'circle' ? 'cross' : 'circle';
}


function generateCircleSVG() {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;

    return `
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
    <circle
        cx="35"
        cy="35"
        r="${radius}"
        fill="none"
        stroke="#00B0EF"
        stroke-width="5"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${circumference}">
        <animate
            attributeName="stroke-dashoffset"
            from="${circumference}"
            to="0"
            dur="0.8s"
            fill="freeze" />
    </circle>
</svg>`;
}
function generateCrossSVG() {
    return `
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
    <line 
        x1="15" y1="15" x2="55" y2="55"
        stroke="#FFC000"
        stroke-width="5"
        stroke-linecap="round"
        stroke-dasharray="60"
        stroke-dashoffset="60">
        <animate 
            attributeName="stroke-dashoffset"
            from="60"
            to="0"
            dur="0.5s"
            fill="freeze" />
    </line>

    <line 
        x1="55" y1="15" x2="15" y2="55"
        stroke="#FFC000"
        stroke-width="5"
        stroke-linecap="round"
        stroke-dasharray="60"
        stroke-dashoffset="60">
        <animate 
            attributeName="stroke-dashoffset"
            from="60"
            to="0"
            dur="0.5s"
            begin="0.3s"
            fill="freeze" />
    </line>
</svg>`;
}

function checkForWin() {
    const winCombos = [
        [0, 1, 2], // Row 1
        [3, 4, 5], // Row 2
        [6, 7, 8], // Row 3
        [0, 3, 6], // Col 1
        [1, 4, 7], // Col 2
        [2, 5, 8], // Col 3
        [0, 4, 8], // Diag 1
        [2, 4, 6]  // Diag 2
    ];

    for (let combo of winCombos) {
        let [a, b, c] = combo;
        if (
            fields[a] &&
            fields[a] === fields[b] &&
            fields[a] === fields[c]
        ) {
            return combo; // Gewinner-Kombination zurückgeben
        }
    }

    return false;
}

function drawWinningLine(combo) {
    const positions = combo.map(index => {
        const cell = document.getElementById('cell-' + index);
        const rect = cell.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 + window.scrollX,
            y: rect.top + rect.height / 2 + window.scrollY
        };
    });

    const start = positions[0];
    const end = positions[2];

    const svgLine = `
        <svg class="win-line" width="100%" height="100%">
            <line 
                x1="${start.x}" 
                y1="${start.y}" 
                x2="${end.x}" 
                y2="${end.y}"
                stroke="white" 
                stroke-width="8"
                stroke-linecap="round"
            />
        </svg>
    `;

    document.body.insertAdjacentHTML("beforeend", svgLine);
}

function disableAllClicks() {
    for (let i = 0; i < 9; i++) {
        let cell = document.getElementById('cell-' + i);
        cell.removeAttribute('onclick');
    }
}

function restartGame() {
    // Felder zurücksetzen
    fields = [null, null, null, null, null, null, null, null, null];

    // Startspieler zurücksetzen
    currentShape = 'circle';

    // Alle gewonnenen Linien entfernen
    document.querySelectorAll('.win-line').forEach(e => e.remove());

    // Neu rendern
    render();
}
