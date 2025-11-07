 document.getElementById("compressBtn").addEventListener("click", function() {
  const fileInput = document.getElementById("fileInput");
  const output = document.getElementById("output");

  if (!fileInput.files.length) {
    output.textContent = "⚠ Please choose a .txt file first!";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result;

    // For now, just show the text length as a test
    output.innerHTML = `
      ✅ File loaded successfully!<br>
      File name: <b>${file.name}</b><br>
      Original size: ${(file.size / 1024).toFixed(2)} KB<br>
      Text length: ${text.length} characters<br>
    `;
  };

  reader.readAsText(file);
});

