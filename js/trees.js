/*************************************************
 * TREES & DATA STRUCTURES VISUALIZER MODULE
 *************************************************/

class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(val) {
        const newNode = new TreeNode(val);
        if (!this.root) {
            this.root = newNode;
            return true;
        }
        let curr = this.root;
        while (true) {
            if (val === curr.val) return false; // No duplicates
            if (val < curr.val) {
                if (!curr.left) {
                    curr.left = newNode;
                    return true;
                }
                curr = curr.left;
            } else {
                if (!curr.right) {
                    curr.right = newNode;
                    return true;
                }
                curr = curr.right;
            }
        }
    }
}

let bst = new BinarySearchTree();
let stackData = [];
let queueData = [];

// Calculate SVG positions for tree nodes
function calculateTreeLayout(node, x = 300, y = 40, offset = 120) {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) calculateTreeLayout(node.left, x - offset, y + 60, offset * 0.55);
    if (node.right) calculateTreeLayout(node.right, x + offset, y + 60, offset * 0.55);
}

function renderTree(highlightVal = null, foundVal = null) {
    const container = document.getElementById("tree-canvas-svg");
    if (!container) return;

    if (!bst.root) {
        container.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="#64748b" font-family="Outfit">Tree is empty. Add nodes below!</text>';
        return;
    }

    calculateTreeLayout(bst.root);
    container.innerHTML = "";

    // Draw Edges First
    function drawEdges(node) {
        if (!node) return;
        if (node.left) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", node.x);
            line.setAttribute("y1", node.y);
            line.setAttribute("x2", node.left.x);
            line.setAttribute("y2", node.left.y);
            line.setAttribute("class", "tree-edge");
            container.appendChild(line);
            drawEdges(node.left);
        }
        if (node.right) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", node.x);
            line.setAttribute("y1", node.y);
            line.setAttribute("x2", node.right.x);
            line.setAttribute("y2", node.right.y);
            line.setAttribute("class", "tree-edge");
            container.appendChild(line);
            drawEdges(node.right);
        }
    }
    drawEdges(bst.root);

    // Draw Nodes
    function drawNodes(node) {
        if (!node) return;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 18);
        circle.setAttribute("class", "node-circle");

        if (node.val === highlightVal) circle.classList.add("active");
        if (node.val === foundVal) circle.classList.add("found");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y);
        text.setAttribute("class", "node-text");
        text.textContent = node.val;

        g.appendChild(circle);
        g.appendChild(text);
        container.appendChild(g);

        drawNodes(node.left);
        drawNodes(node.right);
    }
    drawNodes(bst.root);
}

// TREE ACTIONS
function insertNodeBST() {
    const input = document.getElementById("tree-node-val");
    if (!input || !input.value) return;
    const val = parseInt(input.value);
    bst.insert(val);
    input.value = "";
    codeTracer.loadAlgorithm("bstInsert");
    renderTree(val);
    engine.audio.playPitch(val);
}

async function searchNodeBST() {
    const input = document.getElementById("tree-node-val");
    if (!input || !input.value) return;
    const val = parseInt(input.value);
    codeTracer.loadAlgorithm("bstSearch");
    engine.resetMetrics();

    let curr = bst.root;
    while (curr) {
        engine.addComparison();
        renderTree(curr.val);
        engine.audio.playPitch(curr.val);
        await engine.delay();

        if (curr.val === val) {
            codeTracer.setCommentary(`Node ${val} found in BST!`);
            renderTree(null, val);
            return;
        } else if (val < curr.val) {
            curr = curr.left;
        } else {
            curr = curr.right;
        }
    }
    codeTracer.setCommentary(`Node ${val} not found in BST.`);
    renderTree();
}

function clearTree() {
    bst = new BinarySearchTree();
    renderTree();
}

// STACK & QUEUE ACTIONS
function pushStack() {
    const val = Math.floor(Math.random() * 90) + 10;
    stackData.push(val);
    renderStack();
    engine.audio.playPitch(val);
}

function popStack() {
    if (stackData.length > 0) {
        stackData.pop();
        renderStack();
    }
}

function renderStack() {
    const frame = document.getElementById("stack-frame");
    if (!frame) return;
    frame.innerHTML = "";
    stackData.forEach(val => {
        const el = document.createElement("div");
        el.className = "ds-element";
        el.innerText = val;
        frame.appendChild(el);
    });
}

function enqueueQueue() {
    const val = Math.floor(Math.random() * 90) + 10;
    queueData.push(val);
    renderQueue();
    engine.audio.playPitch(val);
}

function dequeueQueue() {
    if (queueData.length > 0) {
        queueData.shift();
        renderQueue();
    }
}

function renderQueue() {
    const frame = document.getElementById("queue-frame");
    if (!frame) return;
    frame.innerHTML = "";
    queueData.forEach(val => {
        const el = document.createElement("div");
        el.className = "ds-element";
        el.innerText = val;
        frame.appendChild(el);
    });
}
