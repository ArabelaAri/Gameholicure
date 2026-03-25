async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}
async function print() {
    const userId = await getId();
    const toPrint = await window.electronAPI.userItems({ user_id: userId, item_to_update : 0});
    const background = document.getElementById("background");  
    const character = document.getElementById("character"); 
    const animal = document.getElementById("animal");  
    let url;
    toPrint.items.forEach(item => {
        if(item.type === "background" & item.is_active){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/BG/"+item.name;
            background.src = url;
        }
        else if(item.type === "character" & item.is_active){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/CHARS/"+item.name;
            character.src = url;
        }
        else if(item.type === "animal" & item.is_active){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/ANS/"+item.name;
            animal.src = url;
        }
    });
}
print();