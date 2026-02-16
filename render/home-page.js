
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

  const appsList = document.getElementById("statisticsContainer");
  appsList.innerHTML = ""; 

  for (appUser of statisticsResult.appsUser) {
    let timeToPrint = "";
    rawTime = appUser.time_since;
    if (rawTime.years === 0 && rawTime.months === 0 && rawTime.days === 0 && rawTime.hours === 0 && rawTime.minutes === 0) {
      timeToPrint = "Právě teď";
    }
    else {
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

  appName = document.createElement("h2");
  appName.textContent = appUser.name;
  appsList.appendChild(appName);
  appTime = document.createElement("p");
  appTime.textContent = "Čas od posledního spuštění: " + timeToPrint;
  appsList.appendChild(appTime);  
  }
}
printStats();
setInterval(printStats, 60000);