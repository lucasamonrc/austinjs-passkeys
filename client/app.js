async function getMessage() {
  const response = await fetch("/api");
  const data = await response.text();
  alert(data);
}

document.getElementById("btn").addEventListener("click", getMessage);
