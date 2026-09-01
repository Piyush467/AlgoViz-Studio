/*************************************************
 * ADVANCED SEARCHING VISUALIZER MODULE
 *************************************************/

let searchArray = [];
let searchTarget = 45;

function generateSearchArray(size = 15, target = null) {
    searchArray = [];
    for (let i = 0; i < size; i++) {
        searchArray.push(Math.floor(Math.random() * 85) + 10);
    }
    // Sort array for binary / jump search
    searchArray.sort((a, b) => a - b);

    if (target !== null) {
        searchTarget = target;
    } else {
        // Pick random element from array or random number
        searchTarget = searchArray[Math.floor(Math.random() * searchArray.length)];
    }

    const inputEl = document.getElementById("search-target-input");
    if (inputEl) inputEl.value = searchTarget;

    renderSearchBars({ array: [...searchArray], active: [], found: -1, pointers: {} });
}

function renderSearchBars(snapshot) {
    const container = document.getElementById("array-container");
    if (!container) return;
    container.innerHTML = "";

    const { array, active = [], found = -1, pointers = {} } = snapshot;

    array.forEach((val, idx) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${val * 3.5}px`;

        if (active.includes(idx)) bar.classList.add("comparing");
        if (idx === found) bar.classList.add("sorted");

        if (array.length <= 25) {
            bar.innerHTML = `<span class="bar-val">${val}</span>`;
        }

        // Add Pointer Labels
        let labels = [];
        if (pointers.low === idx) labels.push("L");
        if (pointers.mid === idx) labels.push("M");
        if (pointers.high === idx) labels.push("H");
        if (pointers.i === idx) labels.push("i");

        if (labels.length > 0) {
            const ptrDiv = document.createElement("div");
            ptrDiv.style.position = "absolute";
            ptrDiv.style.bottom = "-22px";
            ptrDiv.style.fontSize = "10px";
            ptrDiv.style.fontWeight = "bold";
            ptrDiv.style.color = "#38bdf8";
            ptrDiv.innerText = labels.join(",");
            bar.appendChild(ptrDiv);
        }

        container.appendChild(bar);
    });
}

// LINEAR SEARCH
async function runLinearSearch() {
    codeTracer.loadAlgorithm("linearSearch");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...searchArray];
    let target = parseInt(document.getElementById("search-target-input").value) || searchTarget;

    for (let i = 0; i < arr.length; i++) {
        codeTracer.highlightLine(0);
        engine.addComparison();
        engine.audio.playPitch(arr[i]);

        codeTracer.highlightLine(1);
        if (arr[i] === target) {
            codeTracer.highlightLine(2);
            codeTracer.setCommentary(`Found target ${target} at index ${i}!`);
            await engine.recordFrame({
                array: [...arr], active: [], found: i, pointers: { i }
            }, renderSearchBars);
            return;
        }

        await engine.recordFrame({
            array: [...arr], active: [i], pointers: { i }
        }, renderSearchBars);
    }

    codeTracer.highlightLine(5);
    codeTracer.setCommentary(`Target ${target} not found in array.`);
    await engine.recordFrame({ array: [...arr], active: [], found: -1 }, renderSearchBars);
}

// BINARY SEARCH
async function runBinarySearch() {
    codeTracer.loadAlgorithm("binarySearch");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...searchArray];
    let target = parseInt(document.getElementById("search-target-input").value) || searchTarget;

    let low = 0, high = arr.length - 1;
    codeTracer.highlightLine(0);

    while (low <= high) {
        codeTracer.highlightLine(1);
        let mid = Math.floor((low + high) / 2);
        codeTracer.highlightLine(2);

        engine.addComparison();
        engine.audio.playPitch(arr[mid]);

        await engine.recordFrame({
            array: [...arr], active: [mid], pointers: { low, mid, high }
        }, renderSearchBars);

        codeTracer.highlightLine(3);
        if (arr[mid] === target) {
            codeTracer.setCommentary(`Target ${target} found at mid index ${mid}!`);
            await engine.recordFrame({
                array: [...arr], active: [], found: mid, pointers: { mid }
            }, renderSearchBars);
            return;
        } else if (arr[mid] < target) {
            codeTracer.highlightLine(4);
            low = mid + 1;
        } else {
            codeTracer.highlightLine(5);
            high = mid - 1;
        }
    }

    codeTracer.highlightLine(7);
    codeTracer.setCommentary(`Target ${target} not found in array.`);
    await engine.recordFrame({ array: [...arr], active: [], found: -1 }, renderSearchBars);
}

// JUMP SEARCH
async function runJumpSearch() {
    codeTracer.loadAlgorithm("jumpSearch");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...searchArray];
    let n = arr.length;
    let target = parseInt(document.getElementById("search-target-input").value) || searchTarget;

    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    codeTracer.highlightLine(0);

    while (arr[Math.min(step, n) - 1] < target) {
        codeTracer.highlightLine(1);
        engine.addComparison();
        engine.audio.playPitch(arr[Math.min(step, n) - 1]);

        await engine.recordFrame({
            array: [...arr], active: [Math.min(step, n) - 1], pointers: { low: prev, high: step }
        }, renderSearchBars);

        prev = step;
        step += Math.floor(Math.sqrt(n));
        codeTracer.highlightLine(2);

        if (prev >= n) {
            codeTracer.setCommentary(`Target ${target} not found.`);
            return;
        }
    }

    codeTracer.highlightLine(5);
    while (arr[prev] < target) {
        engine.addComparison();
        engine.audio.playPitch(arr[prev]);

        await engine.recordFrame({
            array: [...arr], active: [prev], pointers: { i: prev }
        }, renderSearchBars);

        prev++;
        if (prev === Math.min(step, n)) {
            codeTracer.setCommentary(`Target ${target} not found.`);
            return;
        }
    }

    codeTracer.highlightLine(8);
    if (arr[prev] === target) {
        codeTracer.setCommentary(`Target ${target} found at index ${prev}!`);
        await engine.recordFrame({
            array: [...arr], active: [], found: prev, pointers: { i: prev }
        }, renderSearchBars);
    }
}
