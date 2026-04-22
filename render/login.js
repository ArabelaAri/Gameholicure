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

btn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const pswd = document.getElementById("pswd").value;

  const result = await window.electronAPI.loginUser({
    username,
    pswd
  });

  if (!result.success) {
    alert("Neplatné přihlašovací údaje. Zkuste to znovu.");
    return;
  }
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
});


