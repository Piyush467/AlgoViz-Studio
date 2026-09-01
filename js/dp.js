/*************************************************
 * DYNAMIC PROGRAMMING VISUALIZER MODULE
 *************************************************/

let knapsackItems = [
    { wt: 2, val: 3 },
    { wt: 3, val: 4 },
    { wt: 4, val: 5 },
    { wt: 5, val: 8 }
];
let knapsackCap = 7;

function renderDPTable(matrix, activeR = -1, activeC = -1) {
    const wrapper = document.getElementById("dp-table-container");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    const table = document.createElement("table");
    table.className = "dp-table";

    // Header Row (Capacities 0 to W)
    const headerTr = document.createElement("tr");
    headerTr.innerHTML = '<th>i \\ w</th>' + Array.from({ length: knapsackCap + 1 }, (_, w) => `<th>${w}</th>`).join("");
    table.appendChild(headerTr);

    matrix.forEach((row, r) => {
        const tr = document.createElement("tr");
        const itemLabel = r === 0 ? "0" : `Item ${r} (w:${knapsackItems[r - 1].wt}, v:${knapsackItems[r - 1].val})`;
        tr.innerHTML = `<th>${itemLabel}</th>`;

        row.forEach((val, c) => {
            const td = document.createElement("td");
            td.innerText = val !== null ? val : "-";
            if (val !== null) td.classList.add("calculated");
            if (r === activeR && c === activeC) td.classList.add("active-cell");
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    wrapper.appendChild(table);
}

// 0/1 KNAPSACK ALGORITHM VISUALIZATION
async function runKnapsackDP() {
    codeTracer.loadAlgorithm("knapsack");
    engine.resetMetrics();
    engine.startTimer();

    const N = knapsackItems.length;
    const W = knapsackCap;
    let dp = Array.from({ length: N + 1 }, () => new Array(W + 1).fill(null));

    // Base cases
    for (let w = 0; w <= W; w++) dp[0][w] = 0;
    for (let i = 0; i <= N; i++) dp[i][0] = 0;

    renderDPTable(dp);

    for (let i = 1; i <= N; i++) {
        codeTracer.highlightLine(0);
        let item = knapsackItems[i - 1];

        for (let w = 1; w <= W; w++) {
            codeTracer.highlightLine(1);
            engine.addComparison();
            engine.audio.playPitch(i * 10 + w);

            codeTracer.highlightLine(2);
            if (item.wt <= w) {
                codeTracer.highlightLine(3);
                dp[i][w] = Math.max(item.val + dp[i - 1][w - item.wt], dp[i - 1][w]);
            } else {
                codeTracer.highlightLine(5);
                dp[i][w] = dp[i - 1][w];
            }

            renderDPTable(dp, i, w);
            await engine.delay();
        }
    }

    codeTracer.setCommentary(`Optimal Knapsack Value for Capacity ${W} is ${dp[N][W]}!`);
    renderDPTable(dp);
}

// FIBONACCI DP ALGORITHM VISUALIZATION
async function runFibonacciDP(n = 8) {
    codeTracer.loadAlgorithm("fibonacci");
    engine.resetMetrics();
    engine.startTimer();

    const wrapper = document.getElementById("dp-table-container");
    if (!wrapper) return;

    let dp = new Array(n + 1).fill(null);
    dp[0] = 0;
    dp[1] = 1;

    renderFibArray(dp, 1);
    await engine.delay();

    for (let i = 2; i <= n; i++) {
        codeTracer.highlightLine(1);
        engine.addComparison();
        engine.audio.playPitch(i * 15);

        codeTracer.highlightLine(2);
        dp[i] = dp[i - 1] + dp[i - 2];

        renderFibArray(dp, i);
        await engine.delay();
    }

    codeTracer.setCommentary(`Fibonacci(${n}) = ${dp[n]}`);
}

function renderFibArray(dp, activeIdx = -1) {
    const wrapper = document.getElementById("dp-table-container");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    const table = document.createElement("table");
    table.className = "dp-table";

    const trIdx = document.createElement("tr");
    trIdx.innerHTML = dp.map((_, i) => `<th>n=${i}</th>`).join("");
    table.appendChild(trIdx);

    const trVal = document.createElement("tr");
    trVal.innerHTML = dp.map((v, i) => {
        let cls = v !== null ? "calculated" : "";
        if (i === activeIdx) cls += " active-cell";
        return `<td class="${cls}">${v !== null ? v : "-"}</td>`;
    }).join("");
    table.appendChild(trVal);

    wrapper.appendChild(table);
}
