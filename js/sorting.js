async function bubbleSort() {
    await resetAlgorithmInfo("Bubble Sort", "O(n²)", "O(1)");

    let bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {

            bars[j].style.background = "red";
            bars[j + 1].style.background = "red";

            updateSteps(); // comparison count
            await sleep(speed);

            if (array[j] > array[j + 1]) {
                // swap
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j] * 2}px`;
                bars[j + 1].style.height = `${array[j + 1] * 2}px`;
            }

            bars[j].style.background = "#38bdf8";
            bars[j + 1].style.background = "#38bdf8";
        }
    }
}


async function mergeSort(l = 0, r = array.length - 1) {
    if (l === 0 && r === array.length - 1) {
        await resetAlgorithmInfo("Merge Sort", "O(n log n)", "O(n)");
    }
    if (l >= r) return;
    let m = Math.floor((l + r) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}


async function merge(l, m, r) {
    let left = array.slice(l, m + 1);
    let right = array.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    let bars = document.getElementsByClassName("bar");

    while (i < left.length && j < right.length) {
        await sleep(speed);
        array[k] = left[i] < right[j] ? left[i++] : right[j++];
        bars[k].style.height = `${array[k] * 2}px`;
        k++;
    }
}

async function quickSort(low = 0, high = array.length - 1) {
    if (low === 0 && high === array.length - 1) {
        await resetAlgorithmInfo("Quick Sort", "O(n log n)", "O(log n)");
    }
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}


async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
    let bars = document.getElementsByClassName("bar");

    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i] * 2}px`;
            bars[j].style.height = `${array[j] * 2}px`;
            await sleep(speed);
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
}
