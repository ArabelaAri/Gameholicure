async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}


async function printInfo() {
    const userId = await getId();
    const userInfo = await window.electronAPI.user({ user_id: userId, coins: 0 });
    const toPrint = await window.electronAPI.userItems({ user_id: userId, item_to_update : 0});
    const profilePic = document.getElementById("profile-pic");

    console.log(toPrint);

    const activeCharacter = toPrint.items.find(
        item => item.type === "character" && item.is_active == true
    );
    console.log(activeCharacter);
    profilePic.src =  "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/CHARS/"+activeCharacter.name;
     

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

async function addApps() {
    const token = await window.electronAPI.getToken();
    const userIdResult = await window.electronAPI.getUserId({ token: token });
    if (userIdResult.success) {
      window.electronAPI.loadPage("render/select-apps.html");
    }
}