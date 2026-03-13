
async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token });
  return userIdResult.user_id;
}

async function printStats() {
  const userId = await getId();
  const statisticsResult = await window.electronAPI.getStatistics(userId);

  if (!statisticsResult.success) {
    alert(statisticsResult.message);
    return;
  }

  const heading = document.getElementById("welcome-header"); 
  const userInfo = await window.electronAPI.user({ user_id: userId, coins: 0 });
  heading.innerHTML = "Vítejte na domovské stránce, " + userInfo.username + "!";
 
  const appsList = document.getElementById("apps-container");
  appsList.innerHTML = ""; 

  if (statisticsResult.appsUser === undefined || statisticsResult.appsUser.length == 0) {
    await window.electronAPI.loadPage("render/select-apps.html");
  }
  for (appUser of statisticsResult.appsUser) {
    let timeToPrint = "";
    rawTime = appUser.time_since;

    if (rawTime.years === 0 && rawTime.months === 0 && rawTime.days === 0 && rawTime.hours === 0 && rawTime.minutes === 0) {
      timeToPrint = "Právě teď";
    } else {
      if (rawTime.years > 0) {
        timeToPrint += rawTime.years + (rawTime.years === 1 ? " rok " : rawTime.years <= 4 ? " roky " : " let ");
      }

      if (rawTime.months > 0) {
        timeToPrint += rawTime.months + (rawTime.months === 1 ? " měsíc " : rawTime.months <= 4 ? " měsíce " : " měsíců ");
      }

      if (rawTime.days > 0) {
        timeToPrint += rawTime.days + (rawTime.days === 1 ? " den " : rawTime.days <= 4 ? " dny " : " dní ");
      }

      if (rawTime.hours > 0) {
        timeToPrint += rawTime.hours + (rawTime.hours === 1 ? " hodina " : rawTime.hours <= 4 ? " hodiny " : " hodin ");
      }

      if (rawTime.minutes > 0) {
        timeToPrint += rawTime.minutes + (rawTime.minutes === 1 ? " minuta" : rawTime.minutes <= 4 ? " minuty" : " minut");
      }
    }

    let card = document.createElement("div");
    let cardI = document.createElement("div");
    let cardF = document.createElement("div");
    let cardB = document.createElement("div");
    //card.classList.add("app-card");
    card.classList.add("card");
    cardI.classList.add("card-inner");
    cardF.classList.add("card-front");
    cardB.classList.add("card-back");

    let appName = document.createElement("h2");
    appName.textContent = appUser.name;

    let appTime = document.createElement("p");
    appTime.textContent = "Čas od posledního spuštění: " + timeToPrint;

    //card.appendChild(appName);
    cardF.appendChild(appName);
    //card.appendChild(appTime);
    cardB.appendChild(appTime);
    cardI.appendChild(cardF);
    cardI.appendChild(cardB);
    card.appendChild(cardI);
    appsList.appendChild(card);
  }
}
printStats();
setInterval(printStats, 60000);