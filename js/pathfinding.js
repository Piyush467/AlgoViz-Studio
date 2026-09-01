/*************************************************
 * ADVANCED PATHFINDING & MAZE VISUALIZER MODULE
 *************************************************/

const pfRows = 14;
const pfCols = 28;

let pfGrid = []; // 2D array storing cell types: 'empty', 'wall', 'weight'
let pfStartNode = [3, 4];
let pfEndNode = [10, 23];

let isMouseDown = false;
let isDraggingStart = false;
let isDraggingEnd = false;
let currentDrawMode = "wall"; // "wall" or "weight"

function initPathfindingGrid() {
    const gridContainer = document.getElementById("grid");
    if (!gridContainer) return;

    gridContainer.style.gridTemplateColumns = `repeat(${pfCols}, 26px)`;
    gridContainer.innerHTML = "";
    pfGrid = [];

    for (let r = 0; r < pfRows; r++) {
        let row = [];
        for (let c = 0; c < pfCols; c++) {
            row.push("empty");

            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.id = `cell-${r}-${c}`;

            if (r === pfStartNode[0] && c === pfStartNode[1]) {
                cell.classList.add("start");
                cell.innerHTML = '<i class="fa-solid fa-play" style="font-size:10px;"></i>';
            } else if (r === pfEndNode[0] && c === pfEndNode[1]) {
                cell.classList.add("end");
                cell.innerHTML = '<i class="fa-solid fa-bullseye" style="font-size:10px;"></i>';
            }

            // Mouse Event Listeners for Drawing & Dragging
            cell.addEventListener("mousedown", (e) => onCellMouseDown(r, c, e));
            cell.addEventListener("mouseenter", () => onCellMouseEnter(r, c));
            cell.addEventListener("mouseup", () => onCellMouseUp());

            gridContainer.appendChild(cell);
        }
        pfGrid.push(row);
    }

    document.addEventListener("mouseup", () => {
        isMouseDown = false;
        isDraggingStart = false;
        isDraggingEnd = false;
    });
}

function onCellMouseDown(r, c, e) {
    e.preventDefault();
    isMouseDown = true;

    if (r === pfStartNode[0] && c === pfStartNode[1]) {
        isDraggingStart = true;
    } else if (r === pfEndNode[0] && c === pfEndNode[1]) {
        isDraggingEnd = true;
    } else {
        toggleCellType(r, c);
    }
}

function onCellMouseEnter(r, c) {
    if (!isMouseDown) return;

    if (isDraggingStart) {
        if (pfGrid[r][c] !== "wall" && !(r === pfEndNode[0] && c === pfEndNode[1])) {
            updateStartNode(r, c);
        }
    } else if (isDraggingEnd) {
        if (pfGrid[r][c] !== "wall" && !(r === pfStartNode[0] && c === pfStartNode[1])) {
            updateEndNode(r, c);
        }
    } else {
        toggleCellType(r, c);
    }
}

function onCellMouseUp() {
    isMouseDown = false;
    isDraggingStart = false;
    isDraggingEnd = false;
}

function updateStartNode(r, c) {
    const oldCell = document.getElementById(`cell-${pfStartNode[0]}-${pfStartNode[1]}`);
    if (oldCell) {
        oldCell.classList.remove("start");
        oldCell.innerHTML = "";
    }
    pfStartNode = [r, c];
    const newCell = document.getElementById(`cell-${r}-${c}`);
    if (newCell) {
        newCell.classList.add("start");
        newCell.innerHTML = '<i class="fa-solid fa-play" style="font-size:10px;"></i>';
    }
}

function updateEndNode(r, c) {
    const oldCell = document.getElementById(`cell-${pfEndNode[0]}-${pfEndNode[1]}`);
    if (oldCell) {
        oldCell.classList.remove("end");
        oldCell.innerHTML = "";
    }
    pfEndNode = [r, c];
    const newCell = document.getElementById(`cell-${r}-${c}`);
    if (newCell) {
        newCell.classList.add("end");
        newCell.innerHTML = '<i class="fa-solid fa-bullseye" style="font-size:10px;"></i>';
    }
}

function toggleCellType(r, c) {
    if ((r === pfStartNode[0] && c === pfStartNode[1]) || (r === pfEndNode[0] && c === pfEndNode[1])) return;

    const cell = document.getElementById(`cell-${r}-${c}`);
    if (!cell) return;

    if (pfGrid[r][c] === "wall") {
        pfGrid[r][c] = "empty";
        cell.className = "cell";
    } else {
        pfGrid[r][c] = currentDrawMode;
        cell.className = `cell ${currentDrawMode}`;
    }
}

function resetPathfindingStates() {
    for (let r = 0; r < pfRows; r++) {
        for (let c = 0; c < pfCols; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) {
                cell.classList.remove("visited", "path");
            }
        }
    }
}

function clearWalls() {
    for (let r = 0; r < pfRows; r++) {
        for (let c = 0; c < pfCols; c++) {
            pfGrid[r][c] = "empty";
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell && !cell.classList.contains("start") && !cell.classList.contains("end")) {
                cell.className = "cell";
            }
        }
    }
}

function highlightPathfindingPath(parentMap) {
    let currKey = `${pfEndNode[0]},${pfEndNode[1]}`;
    while (parentMap[currKey]) {
        const [r, c] = parentMap[currKey].split(",").map(Number);
        if (!(r === pfStartNode[0] && c === pfStartNode[1])) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) cell.classList.add("path");
        }
        currKey = parentMap[currKey];
    }
}

// BREADTH-FIRST SEARCH (BFS)
async function runBFSPathfinding() {
    codeTracer.loadAlgorithm("bfs");
    engine.resetMetrics();
    engine.startTimer();
    resetPathfindingStates();

    let queue = [[...pfStartNode]];
    let visited = new Set([`${pfStartNode[0]},${pfStartNode[1]}`]);
    let parent = {};

    while (queue.length > 0) {
        let [r, c] = queue.shift();
        let key = `${r},${c}`;

        engine.addComparison();
        engine.audio.playPitch(r * pfCols + c, 0, pfRows * pfCols);

        if (r === pfEndNode[0] && c === pfEndNode[1]) {
            codeTracer.setCommentary("Target reached! Highlighting shortest path.");
            highlightPathfindingPath(parent);
            return;
        }

        if (!(r === pfStartNode[0] && c === pfStartNode[1])) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) cell.classList.add("visited");
        }

        await engine.delay();

        for (let [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {
            let nr = r + dr, nc = c + dc;
            let nKey = `${nr},${nc}`;

            if (
                nr >= 0 && nr < pfRows && nc >= 0 && nc < pfCols &&
                !visited.has(nKey) && pfGrid[nr][nc] !== "wall"
            ) {
                visited.add(nKey);
                parent[nKey] = key;
                queue.push([nr, nc]);
            }
        }
    }

    codeTracer.setCommentary("No path found to target.");
}

// DEPTH-FIRST SEARCH (DFS)
async function runDFSPathfinding() {
    codeTracer.loadAlgorithm("dfs");
    engine.resetMetrics();
    engine.startTimer();
    resetPathfindingStates();

    let stack = [[...pfStartNode]];
    let visited = new Set();
    let parent = {};

    while (stack.length > 0) {
        let [r, c] = stack.pop();
        let key = `${r},${c}`;

        if (visited.has(key)) continue;
        visited.add(key);

        engine.addComparison();
        engine.audio.playPitch(r * pfCols + c, 0, pfRows * pfCols);

        if (r === pfEndNode[0] && c === pfEndNode[1]) {
            codeTracer.setCommentary("Target reached via DFS!");
            highlightPathfindingPath(parent);
            return;
        }

        if (!(r === pfStartNode[0] && c === pfStartNode[1])) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) cell.classList.add("visited");
        }

        await engine.delay();

        for (let [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {
            let nr = r + dr, nc = c + dc;
            let nKey = `${nr},${nc}`;

            if (
                nr >= 0 && nr < pfRows && nc >= 0 && nc < pfCols &&
                !visited.has(nKey) && pfGrid[nr][nc] !== "wall"
            ) {
                parent[nKey] = key;
                stack.push([nr, nc]);
            }
        }
    }

    codeTracer.setCommentary("No path found.");
}

// DIJKSTRA'S ALGORITHM
async function runDijkstraPathfinding() {
    codeTracer.loadAlgorithm("dijkstra");
    engine.resetMetrics();
    engine.startTimer();
    resetPathfindingStates();

    let dist = {};
    let parent = {};
    let unvisited = new Set();

    for (let r = 0; r < pfRows; r++) {
        for (let c = 0; c < pfCols; c++) {
            let k = `${r},${c}`;
            dist[k] = Infinity;
            unvisited.add(k);
        }
    }

    let startKey = `${pfStartNode[0]},${pfStartNode[1]}`;
    dist[startKey] = 0;

    while (unvisited.size > 0) {
        let currKey = null;
        let minDist = Infinity;

        for (let k of unvisited) {
            if (dist[k] < minDist) {
                minDist = dist[k];
                currKey = k;
            }
        }

        if (!currKey || minDist === Infinity) break;
        unvisited.delete(currKey);

        let [r, c] = currKey.split(",").map(Number);
        engine.addComparison();
        engine.audio.playPitch(r * pfCols + c, 0, pfRows * pfCols);

        if (r === pfEndNode[0] && c === pfEndNode[1]) {
            codeTracer.setCommentary("Shortest path found by Dijkstra!");
            highlightPathfindingPath(parent);
            return;
        }

        if (!(r === pfStartNode[0] && c === pfStartNode[1])) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) cell.classList.add("visited");
        }

        await engine.delay();

        for (let [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {
            let nr = r + dr, nc = c + dc;
            let nKey = `${nr},${nc}`;

            if (nr >= 0 && nr < pfRows && nc >= 0 && nc < pfCols && unvisited.has(nKey) && pfGrid[nr][nc] !== "wall") {
                let weightCost = pfGrid[nr][nc] === "weight" ? 5 : 1;
                let newDist = dist[currKey] + weightCost;
                if (newDist < dist[nKey]) {
                    dist[nKey] = newDist;
                    parent[nKey] = currKey;
                }
            }
        }
    }

    codeTracer.setCommentary("No path found.");
}

// A* SEARCH ALGORITHM
async function runAStarPathfinding() {
    codeTracer.loadAlgorithm("aStar");
    engine.resetMetrics();
    engine.startTimer();
    resetPathfindingStates();

    let openSet = new Set([`${pfStartNode[0]},${pfStartNode[1]}`]);
    let gScore = {};
    let fScore = {};
    let parent = {};

    let startKey = `${pfStartNode[0]},${pfStartNode[1]}`;
    gScore[startKey] = 0;
    fScore[startKey] = manhattanDist(pfStartNode, pfEndNode);

    while (openSet.size > 0) {
        let currentKey = [...openSet].reduce((a, b) => (fScore[a] || Infinity) < (fScore[b] || Infinity) ? a : b);
        let [r, c] = currentKey.split(",").map(Number);

        if (r === pfEndNode[0] && c === pfEndNode[1]) {
            codeTracer.setCommentary("Optimal path found by A*!");
            highlightPathfindingPath(parent);
            return;
        }

        openSet.delete(currentKey);
        engine.addComparison();
        engine.audio.playPitch(r * pfCols + c, 0, pfRows * pfCols);

        if (!(r === pfStartNode[0] && c === pfStartNode[1])) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) cell.classList.add("visited");
        }

        await engine.delay();

        for (let [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {
            let nr = r + dr, nc = c + dc;
            let nKey = `${nr},${nc}`;

            if (nr >= 0 && nr < pfRows && nc >= 0 && nc < pfCols && pfGrid[nr][nc] !== "wall") {
                let weightCost = pfGrid[nr][nc] === "weight" ? 5 : 1;
                let tentativeG = (gScore[currentKey] || Infinity) + weightCost;

                if (tentativeG < (gScore[nKey] || Infinity)) {
                    parent[nKey] = currentKey;
                    gScore[nKey] = tentativeG;
                    fScore[nKey] = tentativeG + manhattanDist([nr, nc], pfEndNode);
                    openSet.add(nKey);
                }
            }
        }
    }

    codeTracer.setCommentary("No path found.");
}

function manhattanDist(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// MAZE GENERATORS
function generateRandomMaze() {
    clearWalls();
    for (let r = 0; r < pfRows; r++) {
        for (let c = 0; c < pfCols; c++) {
            if (Math.random() < 0.28) {
                if (!(r === pfStartNode[0] && c === pfStartNode[1]) && !(r === pfEndNode[0] && c === pfEndNode[1])) {
                    pfGrid[r][c] = "wall";
                    const cell = document.getElementById(`cell-${r}-${c}`);
                    if (cell) cell.className = "cell wall";
                }
            }
        }
    }
}
