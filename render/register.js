const btn = document.getElementById("registerBtn");
const status = document.getElementById("status");

btn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const pswd = document.getElementById("pswd").value;

  if (!username || !email || !pswd) {
    status.textContent = "Vyplň všechna pole";
    return;
  }

  const result = await window.electronAPI.registerUser({
    username,
    email,
    pswd
  });

  if (result.success) {
    status.textContent = "Registrace byla úspěšná";
  } else {
    status.textContent = result.message;
  }
});
