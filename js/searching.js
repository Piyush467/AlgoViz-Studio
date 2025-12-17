async function binarySearch() {
    prepareBinarySearch();
    let bars = document.getElementsByClassName("bar");
    let target = array[Math.floor(array.length / 2)];
    let l = 0, r = array.length - 1;

    while (l <= r) {
        let mid = Math.floor((l + r) / 2);
        bars[mid].style.background = "yellow";
        await sleep(speed);

        if (array[mid] === target) {
            bars[mid].style.background = "green";
            return;
        } else if (array[mid] < target) l = mid + 1;
        else r = mid - 1;

        bars[mid].style.background = "#38bdf8";
    }
}
