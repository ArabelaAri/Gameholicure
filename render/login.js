function changePage(location){
    window.electronAPI.loadPage(location);
  }

async function checkTokenAndRedirect() {
    const token = await window.electronAPI.getToken();
    const userIdResult = await window.electronAPI.getUserId({ token: token });
    if (userIdResult.success) {
      changePage("render/home-page.html");
    }
}

checkTokenAndRedirect();
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
    
    //store token
  await window.electronAPI.setToken(result.token);

  // get id thanks to token
  const userIdResult = await window.electronAPI.getUserId({ token: result.token });

  if (userIdResult.success) {
    //store the id
    await window.electronAPI.setUserId(userIdResult.user_id);
  } else {
    console.error("Nepodařilo se získat user_id:", userIdResult.message);
  }
    changePage("render/home-page.html");
    //jen na testování přechodu na select-apps stránku
    //changePage("render/select-apps.html");
  } else {
    status.textContent = result.message;
  }
});


