async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}
async function print() {
    const userId = await getId();
    const toPrint = await window.electronAPI.getItems({ user_id: userId});
    const background = document.getElementById("background");  
    const character = document.getElementById("character");  
    let url;
    toPrint.items.forEach(item => {
        if(item.type === "background"){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/BG/"+item.name;
            background.src = url;
        }
        else if(item.type === "character"){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/CHARS/"+item.name;
            character.src = url;
        }
    });
}
print();