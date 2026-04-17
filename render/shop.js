
async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}


async function showItems() {
    const userId = await getId();

    const toPrint = await window.electronAPI.userItems({ user_id: userId, item_to_update : 0});
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
        let owns = false;
        if(owned){
            owns = true 
        } else {
            div.style.backgroundColor = "#e6e6e6";
        }
        img.onclick = () => showItem(shopItem, url, owns);
        div.appendChild(img);
    });
}

const zoom = document.getElementById("zoom");
const zoomImage = document.getElementById("zoom-image");
const price = document.getElementById("price");
const isOwned = document.getElementById("is-owned");
const toSelect = document.getElementById("to-select");
const toBuy = document.getElementById("to-buy");
const modal = document.getElementById("shop-modal");
const userCoins = document.getElementById("user-coins");
const priceItem = document.getElementById("price-item");
const itemToBuy = document.getElementById("item-to-buy");
const buy = document.getElementById("buy");
const selected = document.getElementById("to-select");

let Item;

function showItem(item, url, owns){
    Item = item;
    zoom.src = itemToBuy.src = url;
    if(owns){
        isOwned.innerHTML = "Vlastněno";
        toBuy.hidden = true;
        toSelect.hidden = false;
    }
    else{
        isOwned.innerHTML = "Nevlastněno"
        toBuy.hidden = false;
        toSelect.hidden = true;
    }
    let coinsString;
    if (item.price === 0){
        coinsString = "0 coinů";
    }
    else if(item.price === 1){
        coinsString = "1 coin";
    }
    else if (item.price < 5){
        coinsString = item.price + " coiny"
    }
    else {
        coinsString = item.price + " coinů"
    }
    price.innerHTML = coinsString;
}

showItems();

function closeModal() {
  document.getElementById("shop-modal").style.display = "none";
}

toBuy.onclick = async function () {
    const userId = await getId();
    const userInfo = await window.electronAPI.user({ user_id: userId, coins: 0 });
    userCoins.innerHTML = userInfo.coins;
    priceItem.innerHTML = Item.price;
    modal.style.display = "block";
}

buy.onclick = async function () {
    const userId = await getId();
    const userInfo = await window.electronAPI.user({ user_id: userId, coins: 0 });
    if (userInfo.coins < Item.price) {
        alert("Nemáte dostatek peněz :(");
    }
    else {
        let confirm = window.confirm("Jste si jistí, že chcete kopit tento předmět?")
        if(confirm){
            coins = 0 - Item.price;
            const update = window.electronAPI.userItems({ user_id: userId, item_to_update : Item});
            await window.electronAPI.user({ user_id: userId, coins: coins });
            alert("Předmět je Váš!! :)");
            location.reload();
        }
    }
}

selected.onclick = async function () {
    const userId = await getId();
    let confirm = window.confirm("Jste si jistí, že chcete zvolit tento předmět?")
    if(confirm){
        const update = window.electronAPI.userItems({ user_id: userId, item_to_update : Item});
        if (update.success){
            alert("Předmět byl zvolem :)");
        }
    }
   
}