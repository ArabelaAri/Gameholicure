
async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}


async function showItems() {
    const userId = await getId();

    const toPrint = await window.electronAPI.getItems({ user_id: userId });
    const ownedItems = toPrint.items;

    const shop = await window.electronAPI.getItemsShop();
    const shopItems = shop.items;

    const characters = document.getElementById("characters");
    const animals = document.getElementById("animals");
    const backgrounds = document.getElementById("backgrounds");

    shopItems.forEach(shopItem => {
        const div = document.createElement("div");
        div.classList.add("item");
        const img = document.createElement("img");
        let url;
        if(shopItem.type === "background"){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/BG/" + shopItem.name;
            backgrounds.appendChild(div);
        }

        else if(shopItem.type === "character"){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/CHARS/" + shopItem.name;
            characters.appendChild(div);
        }
        else if(shopItem.type === "animal"){
            url = "https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/PICS/ANS/" + shopItem.name;
            animals.appendChild(div);
        }

        img.src = url;
        const owned = ownedItems.some(o => o.name === shopItem.name);
        if(owned){
            img.onclick = () => activateItem(shopItem, url);
        } else {
            img.onclick = () => buyItem(shopItem, url);
        }
        div.appendChild(img);
    });
}

const zoom = document.getElementById("zoom");

function activateItem(item, url){
    zoom.src = url;
}

function buyItem(item, url){
    zoom.src = url;
}

showItems();