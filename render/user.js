async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}
async function printInfo() {
    const userId = await getId();
    const userInfo = await window.electronAPI.user({ user_id: userId, coins: 0 });

    const username = document.getElementById("username"); 
    username.innerHTML += userInfo.username;
    const email = document.getElementById("email"); 
    email.innerHTML = userInfo.email;
    const coins = document.getElementById("coins"); 
    coins.innerHTML = userInfo.coins;
}
printInfo()

async function logOut(){
    let result = confirm("Jste si jistí, že se chcete odhlástit?");
    if (result) {
        await window.electronAPI.logOut();
    }
}