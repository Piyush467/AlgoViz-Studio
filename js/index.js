/*************************************************
 * ADVANCED DSA VISUALIZER - APPLICATION BOOTSTRAP
 *************************************************/

let activeTab = "tab-sorting";

// Algorithm options per tab
const TAB_ALGORITHMS = {
    "tab-sorting": [
        { val: "bubbleSort", label: "Bubble Sort" },
        { val: "selectionSort", label: "Selection Sort" },
        { val: "insertionSort", label: "Insertion Sort" },
        { val: "quickSort", label: "Quick Sort" },
        { val: "mergeSort", label: "Merge Sort" },
        { val: "heapSort", label: "Heap Sort" },
        { val: "radixSort", label: "Radix Sort" }
    ],
    "tab-searching": [
        { val: "linearSearch", label: "Linear Search" },
        { val: "binarySearch", label: "Binary Search" },
        { val: "jumpSearch", label: "Jump Search" }
    ],
    "tab-pathfinding": [
        { val: "bfs", label: "Breadth-First Search (BFS)" },
        { val: "dfs", label: "Depth-First Search (DFS)" },
        { val: "dijkstra", label: "Dijkstra's Algorithm" },
        { val: "aStar", label: "A* Search Algorithm" }
    ],
    "tab-trees": [
        { val: "bstInsert", label: "Binary Search Tree" }
    ],
    "tab-dp": [
        { val: "knapsack", label: "0/1 Knapsack Problem" },
        { val: "fibonacci", label: "Fibonacci Sequence (DP)" }
    ]
};

window.onload = () => {
    initTabNavigation();
    initGlobalControls();
    switchTab("tab-sorting");
};

function initTabNavigation() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.dataset.tab;
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    activeTab = tabId;
    engine.stop();

    // Update Tab UI
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.toggle("active", content.id === tabId);
    });

    // Populate Algorithm Selector
    populateAlgoSelector(tabId);
    populateModuleCustomControls(tabId);

    // Initializations per module
    if (tabId === "tab-sorting") {
        generateSortingArray("random", sortingArraySize);
        codeTracer.loadAlgorithm("bubbleSort");
    } else if (tabId === "tab-searching") {
        generateSearchArray(15);
        codeTracer.loadAlgorithm("linearSearch");
    } else if (tabId === "tab-pathfinding") {
        initPathfindingGrid();
        codeTracer.loadAlgorithm("bfs");
    } else if (tabId === "tab-trees") {
        renderTree();
        renderStack();
        renderQueue();
        codeTracer.loadAlgorithm("bstInsert");
    } else if (tabId === "tab-dp") {
        runKnapsackDP();
    }
}

function populateAlgoSelector(tabId) {
    const select = document.getElementById("algo-select");
    if (!select) return;
    select.innerHTML = "";

    const algos = TAB_ALGORITHMS[tabId] || [];
    algos.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.val;
        opt.innerText = item.label;
        select.appendChild(opt);
    });

    select.onchange = () => {
        engine.stop();
        codeTracer.loadAlgorithm(select.value);
    };
}

function populateModuleCustomControls(tabId) {
    const container = document.getElementById("module-custom-controls");
    if (!container) return;
    container.innerHTML = "";

    if (tabId === "tab-sorting") {
        container.innerHTML = `
            <select id="sorting-preset-select">
                <option value="random">Random Array</option>
                <option value="nearlySorted">Nearly Sorted</option>
                <option value="reversed">Reversed Array</option>
                <option value="fewUnique">Few Unique</option>
            </select>
        `;
        document.getElementById("sorting-preset-select").onchange = (e) => {
            generateSortingArray(e.target.value, sortingArraySize);
        };
    } else if (tabId === "tab-searching") {
        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="control-label">Target:</span>
                <input type="text" id="search-target-input" value="45" style="width:60px;">
                <button class="btn btn-secondary" onclick="generateSearchArray(15)">New Array</button>
            </div>
        `;
    } else if (tabId === "tab-pathfinding") {
        container.innerHTML = `
            <button class="btn btn-secondary" onclick="generateRandomMaze()"><i class="fa-solid fa-cubes"></i> Maze</button>
            <button class="btn btn-danger" onclick="clearWalls()"><i class="fa-solid fa-trash"></i> Clear Walls</button>
        `;
    } else if (tabId === "tab-trees") {
        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.4rem;">
                <input type="text" id="tree-node-val" placeholder="Val" style="width:55px;">
                <button class="btn btn-secondary" onclick="insertNodeBST()">Insert</button>
                <button class="btn btn-secondary" onclick="searchNodeBST()">Search</button>
                <button class="btn btn-secondary" onclick="pushStack()">Push Stack</button>
                <button class="btn btn-secondary" onclick="popStack()">Pop Stack</button>
                <button class="btn btn-secondary" onclick="enqueueQueue()">Enqueue</button>
                <button class="btn btn-secondary" onclick="dequeueQueue()">Dequeue</button>
            </div>
        `;
    }
}

function initGlobalControls() {
    // Play / Pause Toggle
    const playBtn = document.getElementById("btn-play");
    if (playBtn) {
        playBtn.onclick = () => {
            if (engine.isPlaying) {
                engine.pause();
            } else if (engine.isPaused) {
                engine.resume();
            } else {
                startActiveAlgorithmExecution();
            }
        };
    }

    // Step Controls
    document.getElementById("btn-step-fwd").onclick = () => engine.stepForward();
    document.getElementById("btn-step-back").onclick = () => engine.stepBackward();
    document.getElementById("btn-reset").onclick = () => {
        engine.stop();
        switchTab(activeTab);
    };

    // Speed Slider
    const speedSlider = document.getElementById("slider-speed");
    const speedVal = document.getElementById("val-speed");
    speedSlider.oninput = (e) => {
        const ms = parseInt(e.target.value);
        engine.setSpeed(ms);
        speedVal.innerText = `${ms}ms`;
    };

    // Size Slider
    const sizeSlider = document.getElementById("slider-size");
    const sizeVal = document.getElementById("val-size");
    sizeSlider.oninput = (e) => {
        const val = parseInt(e.target.value);
        sizeVal.innerText = val;
        if (activeTab === "tab-sorting") {
            generateSortingArray("random", val);
        }
    };

    // Audio Toggle
    const audioBtn = document.getElementById("btn-audio-toggle");
    if (audioBtn) {
        audioBtn.onclick = () => {
            engine.audio.enabled = !engine.audio.enabled;
            audioBtn.classList.toggle("active", engine.audio.enabled);
            audioBtn.innerHTML = engine.audio.enabled ? 
                '<i class="fa-solid fa-volume-high"></i>' : 
                '<i class="fa-solid fa-volume-xmark"></i>';
        };
    }
}

function startActiveAlgorithmExecution() {
    engine.isStopped = false;
    engine.isPlaying = true;
    engine.isPaused = false;
    engine.updateControlsUI();

    const algoKey = document.getElementById("algo-select").value;

    try {
        switch (algoKey) {
            // Sorting
            case "bubbleSort": runBubbleSort(); break;
            case "selectionSort": runSelectionSort(); break;
            case "insertionSort": runInsertionSort(); break;
            case "quickSort": runQuickSort(); break;
            case "mergeSort": runMergeSort(); break;
            case "heapSort": runHeapSort(); break;
            case "radixSort": runRadixSort(); break;

            // Searching
            case "linearSearch": runLinearSearch(); break;
            case "binarySearch": runBinarySearch(); break;
            case "jumpSearch": runJumpSearch(); break;

            // Pathfinding
            case "bfs": runBFSPathfinding(); break;
            case "dfs": runDFSPathfinding(); break;
            case "dijkstra": runDijkstraPathfinding(); break;
            case "aStar": runAStarPathfinding(); break;

            // DP
            case "knapsack": runKnapsackDP(); break;
            case "fibonacci": runFibonacciDP(); break;
        }
    } catch (err) {
        console.log("Execution stopped or reset", err);
    }
}
