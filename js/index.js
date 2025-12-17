let array = [];
let speed = 300;
let steps = 0;

const arrayContainer = document.getElementById("array-container");
const speedSlider = document.getElementById("speedSlider");


// Reset algorithm info panel
async function resetAlgorithmInfo(name, time, space) {
    steps = 0;
    document.getElementById("algo-name").innerText = `Algorithm: ${name}`;
    document.getElementById("algo-time").innerText = `Time: ${time}`;
    document.getElementById("algo-space").innerText = `Space: ${space}`;
    document.getElementById("step-count").innerText = `Steps: 0`;
    await sleep(0); // force UI repaint
}

// Update step counter
function updateSteps() {
    steps++;
    document.getElementById("step-count").innerText = `Steps: ${steps}`;
}


// Speed control
speedSlider.oninput = () => speed = speedSlider.value;

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate array
function generateArray(size = 15) {
    array = [];
    arrayContainer.innerHTML = "";

    for (let i = 0; i < size; i++) {
        let value = Math.floor(Math.random() * 90) + 10;
        array.push(value);

        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${value * 2}px`;
        arrayContainer.appendChild(bar);
    }
}

// Render array
function renderArray() {
    arrayContainer.innerHTML = "";
    array.forEach(v => {
        let bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${v * 2}px`;
        arrayContainer.appendChild(bar);
    });
}

// Sort before binary search
function prepareBinarySearch() {
    array.sort((a, b) => a - b);
    renderArray();
}

// Init
window.onload = () => {
    generateArray();
};
