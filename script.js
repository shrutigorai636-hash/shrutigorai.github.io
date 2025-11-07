// Huffman Node class
class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

// Build frequency table
function buildFrequencyTable(text) {
  const freq = {};
  for (let char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

// Build Huffman Tree
function buildHuffmanTree(freqTable) {
  const nodes = Object.entries(freqTable).map(([char, freq]) => new Node(char, freq));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const newNode = new Node(null, left.freq + right.freq, left, right);
    nodes.push(newNode);
  }
  return nodes[0];
}

// Generate codes
function generateCodes(node, code = "", map = {}) {
  if (!node) return;
  if (node.char !== null) {
    map[node.char] = code;
  }
  generateCodes(node.left, code + "0", map);
  generateCodes(node.right, code + "1", map);
  return map;
}

// Encode
function encode(text, codes) {
  return text.split("").map(char => codes[char]).join("");
}

// Decode
function decode(encodedText, tree) {
  let result = "";
  let node = tree;
  for (let bit of encodedText) {
    node = bit === "0" ? node.left : node.right;
    if (node.char !== null) {
      result += node.char;
      node = tree;
    }
  }
  return result;
}

// DOM handling
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const compressBtn = document.getElementById("compressBtn");
const decompressBtn = document.getElementById("decompressBtn");
const statsDiv = document.getElementById("stats");

let savedTree = null;
let compressedData = "";

compressBtn.addEventListener("click", () => {
  const text = inputText.value.trim();
  if (!text) {
    alert("Please enter some text first!");
    return;
  }

  const freqTable = buildFrequencyTable(text);
  const tree = buildHuffmanTree(freqTable);
  const codes = generateCodes(tree);
  const encoded = encode(text, codes);

  savedTree = tree;
  compressedData = encoded;

  outputText.value = encoded;

  const originalBits = text.length * 8;
  const compressedBits = encoded.length;
  const ratio = ((1 - compressedBits / originalBits) * 100).toFixed(2);

  statsDiv.innerHTML = `
    <strong>Original size:</strong> ${originalBits} bits<br>
    <strong>Compressed size:</strong> ${compressedBits} bits<br>
    <strong>Compression ratio:</strong> ${ratio}%<br>
  `;
});

decompressBtn.addEventListener("click", () => {
  if (!savedTree || !compressedData) {
    alert("Please compress some text first!");
    return;
  }

  const decoded = decode(compressedData, savedTree);
  outputText.value = decoded;
  statsDiv.innerHTML = <strong>Decompressed successfully!</strong>;
});
