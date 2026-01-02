function changePage(location){
    window.electronAPI.loadPage(location);
  }

const btn = document.getElementById("loginBtn");
const status = document.getElementById("status");

btn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const pswd = document.getElementById("pswd").value;

  if (!username || !pswd) {
    status.textContent = "Vyplňte prosím všechna pole";
    return;
  }

  const result = await window.electronAPI.loginUser({
    username,
    pswd
  });

  if (result.success) {
    status.textContent = "Přihlášení bylo úspěšné";
    changePage("render/home-page.html");
  } else {
    status.textContent = result.message;
  }
});


