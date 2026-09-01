/*************************************************
 * ADVANCED SORTING VISUALIZER MODULE
 *************************************************/

let sortingArray = [];
let sortingArraySize = 20;

function generateSortingArray(type = "random", size = sortingArraySize) {
    sortingArraySize = size;
    sortingArray = [];

    if (type === "random") {
        for (let i = 0; i < size; i++) {
            sortingArray.push(Math.floor(Math.random() * 85) + 15);
        }
    } else if (type === "reversed") {
        for (let i = 0; i < size; i++) {
            sortingArray.push(Math.floor(95 - (i / size) * 80));
        }
    } else if (type === "nearlySorted") {
        for (let i = 0; i < size; i++) {
            sortingArray.push(Math.floor(15 + (i / size) * 80));
        }
        // Swap a few random pairs
        for (let k = 0; k < Math.floor(size / 5); k++) {
            let idx1 = Math.floor(Math.random() * size);
            let idx2 = Math.floor(Math.random() * size);
            [sortingArray[idx1], sortingArray[idx2]] = [sortingArray[idx2], sortingArray[idx1]];
        }
    } else if (type === "fewUnique") {
        const set = [25, 45, 65, 85];
        for (let i = 0; i < size; i++) {
            sortingArray.push(set[Math.floor(Math.random() * set.length)]);
        }
    }

    renderSortingBars({ array: [...sortingArray], comparing: [], swapping: [], sorted: [], pivot: -1 });
}

function renderSortingBars(snapshot) {
    const container = document.getElementById("array-container");
    if (!container) return;
    container.innerHTML = "";

    const { array, comparing = [], swapping = [], sorted = [], pivot = -1 } = snapshot;

    array.forEach((val, idx) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${val * 3.5}px`;

        if (comparing.includes(idx)) bar.classList.add("comparing");
        if (swapping.includes(idx)) bar.classList.add("swapping");
        if (sorted.includes(idx)) bar.classList.add("sorted");
        if (idx === pivot) bar.classList.add("pivot");

        if (array.length <= 25) {
            bar.innerHTML = `<span class="bar-val">${val}</span>`;
        }

        container.appendChild(bar);
    });
}

// BUBBLE SORT
async function runBubbleSort() {
    codeTracer.loadAlgorithm("bubbleSort");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...sortingArray];
    let n = arr.length;
    let sortedIndices = [];

    for (let i = 0; i < n; i++) {
        codeTracer.highlightLine(0);
        for (let j = 0; j < n - i - 1; j++) {
            codeTracer.highlightLine(1);
            engine.addComparison();
            engine.audio.playPitch(arr[j]);

            await engine.recordFrame({
                array: [...arr], comparing: [j, j + 1], sorted: [...sortedIndices]
            }, renderSortingBars);

            codeTracer.highlightLine(2);
            if (arr[j] > arr[j + 1]) {
                codeTracer.highlightLine(3);
                engine.addSwap();
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                await engine.recordFrame({
                    array: [...arr], swapping: [j, j + 1], sorted: [...sortedIndices]
                }, renderSortingBars);
            }
        }
        sortedIndices.push(n - i - 1);
    }

    codeTracer.setCommentary("Sorting completed!");
    await engine.recordFrame({ array: [...arr], sorted: Array.from({length: n}, (_, k) => k) }, renderSortingBars);
}

// SELECTION SORT
async function runSelectionSort() {
    codeTracer.loadAlgorithm("selectionSort");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...sortingArray];
    let n = arr.length;
    let sortedIndices = [];

    for (let i = 0; i < n; i++) {
        codeTracer.highlightLine(0);
        let minIdx = i;
        codeTracer.highlightLine(1);

        for (let j = i + 1; j < n; j++) {
            codeTracer.highlightLine(2);
            engine.addComparison();
            engine.audio.playPitch(arr[j]);

            await engine.recordFrame({
                array: [...arr], comparing: [j, minIdx], pivot: minIdx, sorted: [...sortedIndices]
            }, renderSortingBars);

            codeTracer.highlightLine(3);
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        codeTracer.highlightLine(5);
        if (minIdx !== i) {
            engine.addSwap();
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            await engine.recordFrame({
                array: [...arr], swapping: [i, minIdx], sorted: [...sortedIndices]
            }, renderSortingBars);
        }
        sortedIndices.push(i);
    }

    codeTracer.setCommentary("Sorting completed!");
    await engine.recordFrame({ array: [...arr], sorted: Array.from({length: n}, (_, k) => k) }, renderSortingBars);
}

// INSERTION SORT
async function runInsertionSort() {
    codeTracer.loadAlgorithm("insertionSort");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...sortingArray];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
        codeTracer.highlightLine(0);
        let key = arr[i];
        let j = i - 1;
        codeTracer.highlightLine(1);

        while (j >= 0 && arr[j] > key) {
            codeTracer.highlightLine(3);
            engine.addComparison();
            engine.addSwap();
            engine.audio.playPitch(arr[j]);

            arr[j + 1] = arr[j];
            await engine.recordFrame({
                array: [...arr], swapping: [j, j + 1], pivot: i
            }, renderSortingBars);

            j--;
        }
        arr[j + 1] = key;
        codeTracer.highlightLine(7);
        await engine.recordFrame({
            array: [...arr], sorted: Array.from({length: i + 1}, (_, k) => k)
        }, renderSortingBars);
    }

    codeTracer.setCommentary("Sorting completed!");
    await engine.recordFrame({ array: [...arr], sorted: Array.from({length: n}, (_, k) => k) }, renderSortingBars);
}

// QUICK SORT
async function runQuickSort() {
    codeTracer.loadAlgorithm("quickSort");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...sortingArray];

    async function partition(low, high) {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            engine.addComparison();
            engine.audio.playPitch(arr[j]);

            await engine.recordFrame({
                array: [...arr], comparing: [j, high], pivot: high
            }, renderSortingBars);

            if (arr[j] < pivot) {
                i++;
                engine.addSwap();
                [arr[i], arr[j]] = [arr[j], arr[i]];
                await engine.recordFrame({
                    array: [...arr], swapping: [i, j], pivot: high
                }, renderSortingBars);
            }
        }
        engine.addSwap();
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        await engine.recordFrame({
            array: [...arr], swapping: [i + 1, high]
        }, renderSortingBars);

        return i + 1;
    }

    async function quickSortRecursive(low, high) {
        if (low < high) {
            codeTracer.highlightLine(2);
            let pi = await partition(low, high);
            codeTracer.highlightLine(3);
            await quickSortRecursive(low, pi - 1);
            codeTracer.highlightLine(4);
            await quickSortRecursive(pi + 1, high);
        }
    }

    await quickSortRecursive(0, arr.length - 1);
    codeTracer.setCommentary("Sorting completed!");
    await engine.recordFrame({ array: [...arr], sorted: Array.from({length: arr.length}, (_, k) => k) }, renderSortingBars);
}

// MERGE SORT
async function runMergeSort() {
    codeTracer.loadAlgorithm("mergeSort");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...sortingArray];

    async function merge(l, m, r) {
        let left = arr.slice(l, m + 1);
        let right = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;

        while (i < left.length && j < right.length) {
            engine.addComparison();
            engine.audio.playPitch(left[i]);

            if (left[i] <= right[j]) {
                arr[k] = left[i++];
            } else {
                arr[k] = right[j++];
            }
            engine.addSwap();
            await engine.recordFrame({ array: [...arr], swapping: [k] }, renderSortingBars);
            k++;
        }

        while (i < left.length) {
            arr[k] = left[i++];
            engine.addSwap();
            await engine.recordFrame({ array: [...arr], swapping: [k] }, renderSortingBars);
            k++;
        }
        while (j < right.length) {
            arr[k] = right[j++];
            engine.addSwap();
            await engine.recordFrame({ array: [...arr], swapping: [k] }, renderSortingBars);
            k++;
        }
    }

    async function mergeSortRecursive(l, r) {
        if (l >= r) return;
        let m = Math.floor((l + r) / 2);
        codeTracer.highlightLine(3);
        await mergeSortRecursive(l, m);
        codeTracer.highlightLine(4);
        await mergeSortRecursive(m + 1, r);
        codeTracer.highlightLine(5);
        await merge(l, m, r);
    }

    await mergeSortRecursive(0, arr.length - 1);
    codeTracer.setCommentary("Sorting completed!");
    await engine.recordFrame({ array: [...arr], sorted: Array.from({length: arr.length}, (_, k) => k) }, renderSortingBars);
}

// HEAP SORT
async function runHeapSort() {
    codeTracer.loadAlgorithm("heapSort");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...sortingArray];
    let n = arr.length;

    async function heapify(size, root) {
        let largest = root;
        let left = 2 * root + 1;
        let right = 2 * root + 2;

        if (left < size) {
            engine.addComparison();
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < size) {
            engine.addComparison();
            if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== root) {
            engine.addSwap();
            [arr[root], arr[largest]] = [arr[largest], arr[root]];
            engine.audio.playPitch(arr[root]);
            await engine.recordFrame({ array: [...arr], swapping: [root, largest] }, renderSortingBars);
            await heapify(size, largest);
        }
    }

    codeTracer.highlightLine(0);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    codeTracer.highlightLine(1);
    for (let i = n - 1; i > 0; i--) {
        engine.addSwap();
        [arr[0], arr[i]] = [arr[i], arr[0]];
        codeTracer.highlightLine(2);
        await engine.recordFrame({ array: [...arr], swapping: [0, i], sorted: Array.from({length: n - i}, (_, k) => n - 1 - k) }, renderSortingBars);
        codeTracer.highlightLine(3);
        await heapify(i, 0);
    }

    codeTracer.setCommentary("Heap Sort completed!");
    await engine.recordFrame({ array: [...arr], sorted: Array.from({length: n}, (_, k) => k) }, renderSortingBars);
}

// RADIX SORT
async function runRadixSort() {
    codeTracer.loadAlgorithm("radixSort");
    engine.resetMetrics();
    engine.startTimer();
    let arr = [...sortingArray];

    let maxVal = Math.max(...arr);
    codeTracer.highlightLine(0);

    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
        codeTracer.highlightLine(1);
        let output = new Array(arr.length).fill(0);
        let count = new Array(10).fill(0);

        for (let i = 0; i < arr.length; i++) {
            count[Math.floor(arr[i] / exp) % 10]++;
            engine.addComparison();
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = arr.length - 1; i >= 0; i--) {
            let digit = Math.floor(arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
            engine.addSwap();
            engine.audio.playPitch(arr[i]);
        }

        for (let i = 0; i < arr.length; i++) {
            arr[i] = output[i];
            await engine.recordFrame({ array: [...arr], swapping: [i] }, renderSortingBars);
        }
    }

    codeTracer.setCommentary("Radix Sort completed!");
    await engine.recordFrame({ array: [...arr], sorted: Array.from({length: arr.length}, (_, k) => k) }, renderSortingBars);
}
