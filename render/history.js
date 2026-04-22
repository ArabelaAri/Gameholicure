
async function loadHistory() {
  const history = await window.electronAPI.printHistory();
  const historyList = document.getElementById("historyContainer");
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

loadHistory();