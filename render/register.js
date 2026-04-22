const btn = document.getElementById("registerBtn");
const status = document.getElementById("status");

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

btn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const pswd = document.getElementById("pswd").value;

  if (!username || !email || !pswd) {
    alert("Prosím, vyplňte všechna pole");
    return;
  }

  if (!validateEmail(email)) {
    alert("Neplatný formát emailu");
    return;
  }

  const result = await window.electronAPI.registerUser({
    username,
    email,
    pswd
  });

  if (result.success) {
    await window.electronAPI.loadPage("render/login.html");
  } else {
  alert(result.message);
  }
});
