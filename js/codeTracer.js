/*************************************************
 * CODE TRACER ENGINE & PSEUDOCODE DATABASE
 *************************************************/

const ALGORITHM_METADATA = {
    // SORTING
    "bubbleSort": {
        name: "Bubble Sort",
        category: "Sorting",
        time: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        space: "O(1)",
        code: [
            "for i = 0 to n - 1 do",
            "  for j = 0 to n - i - 2 do",
            "    if array[j] > array[j + 1] then",
            "      swap(array[j], array[j + 1])",
            "    end if",
            "  end for",
            "end for"
        ]
    },
    "selectionSort": {
        name: "Selection Sort",
        category: "Sorting",
        time: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)" },
        space: "O(1)",
        code: [
            "for i = 0 to n - 1 do",
            "  minIdx = i",
            "  for j = i + 1 to n - 1 do",
            "    if array[j] < array[minIdx] then minIdx = j",
            "  end for",
            "  if minIdx != i then swap(array[i], array[minIdx])",
            "end for"
        ]
    },
    "insertionSort": {
        name: "Insertion Sort",
        category: "Sorting",
        time: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
        space: "O(1)",
        code: [
            "for i = 1 to n - 1 do",
            "  key = array[i]",
            "  j = i - 1",
            "  while j >= 0 and array[j] > key do",
            "    array[j + 1] = array[j]",
            "    j = j - 1",
            "  end while",
            "  array[j + 1] = key",
            "end for"
        ]
    },
    "quickSort": {
        name: "Quick Sort",
        category: "Sorting",
        time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)" },
        space: "O(log n)",
        code: [
            "function quickSort(low, high):",
            "  if low < high then",
            "    pivotIdx = partition(low, high)",
            "    quickSort(low, pivotIdx - 1)",
            "    quickSort(pivotIdx + 1, high)",
            "  end if"
        ]
    },
    "mergeSort": {
        name: "Merge Sort",
        category: "Sorting",
        time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        space: "O(n)",
        code: [
            "function mergeSort(left, right):",
            "  if left >= right then return",
            "  mid = floor((left + right) / 2)",
            "  mergeSort(left, mid)",
            "  mergeSort(mid + 1, right)",
            "  merge(left, mid, right)"
        ]
    },
    "heapSort": {
        name: "Heap Sort",
        category: "Sorting",
        time: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
        space: "O(1)",
        code: [
            "buildMaxHeap(array)",
            "for i = n - 1 down to 1 do",
            "  swap(array[0], array[i])",
            "  heapify(array, i, 0)",
            "end for"
        ]
    },
    "radixSort": {
        name: "Radix Sort",
        category: "Sorting",
        time: { best: "O(nk)", avg: "O(nk)", worst: "O(nk)" },
        space: "O(n + k)",
        code: [
            "maxVal = getMax(array)",
            "for exp = 1; maxVal / exp > 0; exp *= 10 do",
            "  countingSortByDigit(array, exp)",
            "end for"
        ]
    },

    // SEARCHING
    "linearSearch": {
        name: "Linear Search",
        category: "Searching",
        time: { best: "O(1)", avg: "O(n)", worst: "O(n)" },
        space: "O(1)",
        code: [
            "for i = 0 to n - 1 do",
            "  if array[i] == target then",
            "    return i // Found!",
            "  end if",
            "end for",
            "return -1 // Not Found"
        ]
    },
    "binarySearch": {
        name: "Binary Search",
        category: "Searching",
        time: { best: "O(1)", avg: "O(log n)", worst: "O(log n)" },
        space: "O(1)",
        code: [
            "low = 0, high = n - 1",
            "while low <= high do",
            "  mid = floor((low + high) / 2)",
            "  if array[mid] == target then return mid",
            "  else if array[mid] < target then low = mid + 1",
            "  else high = mid - 1",
            "end while",
            "return -1"
        ]
    },
    "jumpSearch": {
        name: "Jump Search",
        category: "Searching",
        time: { best: "O(1)", avg: "O(√n)", worst: "O(√n)" },
        space: "O(1)",
        code: [
            "step = floor(sqrt(n)), prev = 0",
            "while array[min(step, n) - 1] < target do",
            "  prev = step, step += floor(sqrt(n))",
            "  if prev >= n then return -1",
            "end while",
            "while array[prev] < target do",
            "  prev++ if prev == min(step, n) return -1",
            "end while",
            "if array[prev] == target return prev"
        ]
    },

    // PATHFINDING
    "bfs": {
        name: "Breadth-First Search (BFS)",
        category: "Pathfinding",
        time: { best: "O(V + E)", avg: "O(V + E)", worst: "O(V + E)" },
        space: "O(V)",
        code: [
            "queue = [start], visited = {start}",
            "while queue is not empty do",
            "  node = queue.pop()",
            "  if node == target then return path",
            "  for each neighbor of node do",
            "    if neighbor not in visited then",
            "      visited.add(neighbor), queue.push(neighbor)",
            "    end if",
            "  end for",
            "end while"
        ]
    },
    "dfs": {
        name: "Depth-First Search (DFS)",
        category: "Pathfinding",
        time: { best: "O(V + E)", avg: "O(V + E)", worst: "O(V + E)" },
        space: "O(V)",
        code: [
            "stack = [start], visited = {start}",
            "while stack is not empty do",
            "  node = stack.pop()",
            "  if node == target then return path",
            "  for each neighbor of node do",
            "    if neighbor not in visited then",
            "      visited.add(neighbor), stack.push(neighbor)",
            "    end if",
            "  end for",
            "end while"
        ]
    },
    "dijkstra": {
        name: "Dijkstra's Algorithm",
        category: "Pathfinding",
        time: { best: "O(E log V)", avg: "O(E log V)", worst: "O(E log V)" },
        space: "O(V)",
        code: [
            "dist[start] = 0, pq = {start: 0}",
            "while pq is not empty do",
            "  curr = node with min dist in pq",
            "  if curr == target then return reconstructPath()",
            "  for each neighbor of curr do",
            "    newDist = dist[curr] + weight(curr, neighbor)",
            "    if newDist < dist[neighbor] then",
            "      dist[neighbor] = newDist, pq.push(neighbor, newDist)",
            "    end if",
            "  end for",
            "end while"
        ]
    },
    "aStar": {
        name: "A* Search Algorithm",
        category: "Pathfinding",
        time: { best: "O(E)", avg: "O(E)", worst: "O(V)" },
        space: "O(V)",
        code: [
            "gScore[start] = 0, fScore[start] = heuristic(start, target)",
            "openSet = {start}",
            "while openSet is not empty do",
            "  curr = node in openSet with min fScore",
            "  if curr == target then return reconstructPath()",
            "  openSet.remove(curr)",
            "  for each neighbor of curr do",
            "    tentativeG = gScore[curr] + cost(curr, neighbor)",
            "    if tentativeG < gScore[neighbor] then",
            "      gScore[neighbor] = tentativeG",
            "      fScore[neighbor] = tentativeG + heuristic(neighbor, target)",
            "      openSet.add(neighbor)",
            "    end if",
            "  end for",
            "end while"
        ]
    },

    // TREES & DATA STRUCTURES
    "bstInsert": {
        name: "Binary Search Tree - Insert",
        category: "Trees",
        time: { best: "O(log n)", avg: "O(log n)", worst: "O(n)" },
        space: "O(h)",
        code: [
            "function insert(node, val):",
            "  if node == null then return new Node(val)",
            "  if val < node.val then node.left = insert(node.left, val)",
            "  else if val > node.val then node.right = insert(node.right, val)",
            "  return node"
        ]
    },
    "bstSearch": {
        name: "Binary Search Tree - Search",
        category: "Trees",
        time: { best: "O(1)", avg: "O(log n)", worst: "O(n)" },
        space: "O(h)",
        code: [
            "function search(node, val):",
            "  if node == null or node.val == val return node",
            "  if val < node.val return search(node.left, val)",
            "  return search(node.right, val)"
        ]
    },

    // DYNAMIC PROGRAMMING
    "knapsack": {
        name: "0/1 Knapsack Problem",
        category: "Dynamic Programming",
        time: { best: "O(N * W)", avg: "O(N * W)", worst: "O(N * W)" },
        space: "O(N * W)",
        code: [
            "for i = 1 to N do",
            "  for w = 1 to W do",
            "    if wt[i-1] <= w then",
            "      dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])",
            "    else",
            "      dp[i][w] = dp[i-1][w]",
            "    end if",
            "  end for",
            "end for"
        ]
    },
    "fibonacci": {
        name: "Fibonacci (DP Tabulation)",
        category: "Dynamic Programming",
        time: { best: "O(n)", avg: "O(n)", worst: "O(n)" },
        space: "O(n)",
        code: [
            "dp[0] = 0, dp[1] = 1",
            "for i = 2 to n do",
            "  dp[i] = dp[i - 1] + dp[i - 2]",
            "end for",
            "return dp[n]"
        ]
    }
};

class CodeTracer {
    constructor() {
        this.currentKey = null;
    }

    loadAlgorithm(algoKey) {
        const data = ALGORITHM_METADATA[algoKey];
        if (!data) return;

        this.currentKey = algoKey;

        // Set Metadata UI
        document.getElementById("algo-title").innerText = data.name;
        document.getElementById("badge-time-best").innerText = data.time.best;
        document.getElementById("badge-time-avg").innerText = data.time.avg;
        document.getElementById("badge-time-worst").innerText = data.time.worst;
        document.getElementById("badge-space").innerText = data.space;

        // Render Pseudocode
        const codeContainer = document.getElementById("code-tracer-lines");
        if (codeContainer) {
            codeContainer.innerHTML = "";
            data.code.forEach((lineText, idx) => {
                const lineDiv = document.createElement("div");
                lineDiv.className = "code-line";
                lineDiv.id = `code-line-${idx}`;
                lineDiv.innerHTML = `<span class="line-num">${idx + 1}</span><span>${this.escapeHTML(lineText)}</span>`;
                codeContainer.appendChild(lineDiv);
            });
        }

        this.setCommentary("Ready to run algorithm.");
    }

    highlightLine(lineIdx) {
        if (!this.currentKey) return;
        const lines = document.querySelectorAll(".code-line");
        lines.forEach(el => el.classList.remove("active"));

        if (lineIdx >= 0) {
            const activeLine = document.getElementById(`code-line-${lineIdx}`);
            if (activeLine) {
                activeLine.classList.add("active");
                activeLine.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    }

    setCommentary(text) {
        const commentEl = document.getElementById("step-commentary");
        if (commentEl) {
            commentEl.innerText = text;
        }
    }

    escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}

// Global Tracer Instance
const codeTracer = new CodeTracer();
