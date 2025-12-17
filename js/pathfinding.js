/*************************************************
 * GRID SETUP & GLOBAL STATE
 *************************************************/

const grid = document.getElementById("grid");
const rows = 10, cols = 15;

let cells = [];
let start = [0, 0];
let end = [9, 14];

/*************************************************
 * GRID UTILITIES
 *************************************************/

// Create grid
function createGrid() {
    grid.innerHTML = "";
    cells = [];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";

            if (r === start[0] && c === start[1]) cell.classList.add("start");
            if (r === end[0] && c === end[1]) cell.classList.add("end");

            cell.onclick = () => cell.classList.toggle("wall");

            grid.appendChild(cell);
            row.push(cell);
        }
        cells.push(row);
    }
}

// Clear visited/path states
function resetGridState() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells[r][c].classList.remove("visited", "path");
        }
    }
}

/*************************************************
 * PATH HIGHLIGHTING
 *************************************************/

// Highlight final path using parent map
function highlightPath(parent) {
    let cur = `${end[0]},${end[1]}`;
    while (parent[cur]) {
        let [r, c] = parent[cur].split(",").map(Number);
        cells[r][c].classList.add("path");
        cur = parent[cur];
    }
}

/*************************************************
 * BFS ALGORITHM
 *************************************************/

async function runBFS() {
    resetGridState();
    await resetAlgorithmInfo("BFS", "O(V + E)", "O(V)");

    let queue = [[...start]];
    let visited = new Set();
    let parent = {};

    while (queue.length) {
        let [r, c] = queue.shift();
        let key = `${r},${c}`;

        if (visited.has(key)) continue;
        visited.add(key);
        updateSteps();

        let cell = cells[r][c];
        if (!cell.classList.contains("start"))
            cell.classList.add("visited");

        if (r === end[0] && c === end[1]) {
            highlightPath(parent);
            return;
        }

        for (let [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            let nr = r + dr, nc = c + dc;
            let nextKey = `${nr},${nc}`;

            if (
                nr >= 0 && nc >= 0 &&
                nr < rows && nc < cols &&
                !visited.has(nextKey) &&
                !cells[nr][nc].classList.contains("wall")
            ) {
                parent[nextKey] = key;
                queue.push([nr, nc]);
            }
        }
        await sleep(speed);
    }
}

/*************************************************
 * DFS ALGORITHM (WRAPPER + RECURSION)
 *************************************************/

// Wrapper to start DFS safely
async function startDFS() {
    resetGridState();
    await resetAlgorithmInfo("DFS", "O(V + E)", "O(V)");
    await runDFS();
}

// Recursive DFS
async function runDFS(r = start[0], c = start[1], visited = new Set(), parent = {}) {
    let key = `${r},${c}`;

    if (
        r < 0 || c < 0 || r >= rows || c >= cols ||
        visited.has(key) ||
        cells[r][c].classList.contains("wall")
    ) return false;

    visited.add(key);
    updateSteps();

    let cell = cells[r][c];
    if (!cell.classList.contains("start"))
        cell.classList.add("visited");

    if (r === end[0] && c === end[1]) {
        highlightPath(parent);
        return true;
    }

    await sleep(speed);

    for (let [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        let nr = r + dr, nc = c + dc;
        parent[`${nr},${nc}`] = key;
        if (await runDFS(nr, nc, visited, parent)) return true;
    }
    return false;
}

/*************************************************
 * A* PATHFINDING
 *************************************************/

async function runAStar() {
    resetGridState();
    await resetAlgorithmInfo("A*", "O(E)", "O(V)");

    let openSet = new Set([`${start[0]},${start[1]}`]);
    let gScore = {};
    let fScore = {};
    let parent = {};

    gScore[`${start[0]},${start[1]}`] = 0;
    fScore[`${start[0]},${start[1]}`] = heuristic(start, end);

    while (openSet.size) {
        let current = [...openSet].reduce((a, b) =>
            fScore[a] < fScore[b] ? a : b
        );

        openSet.delete(current);
        updateSteps();

        let [r, c] = current.split(",").map(Number);

        if (r === end[0] && c === end[1]) {
            highlightPath(parent);
            return;
        }

        cells[r][c].classList.add("visited");
        await sleep(speed);

        for (let [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            let nr = r + dr, nc = c + dc;
            let neighbor = `${nr},${nc}`;

            if (
                nr < 0 || nc < 0 ||
                nr >= rows || nc >= cols ||
                cells[nr][nc].classList.contains("wall")
            ) continue;

            let tentativeG = (gScore[current] || Infinity) + 1;

            if (tentativeG < (gScore[neighbor] || Infinity)) {
                parent[neighbor] = current;
                gScore[neighbor] = tentativeG;
                fScore[neighbor] = tentativeG + heuristic([nr, nc], end);
                openSet.add(neighbor);
            }
        }
    }
}

/*************************************************
 * HEURISTIC FUNCTION
 *************************************************/

// Manhattan distance heuristic
function heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
