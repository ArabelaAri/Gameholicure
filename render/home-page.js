
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

    let container = document.createElement("div");
    container.classList.add("stat-block");

    let name = document.createElement("h2");
    name.textContent = appUser.name;

    let time = document.createElement("p");
    time.textContent = "Čas od posledního spuštění: " + timeToPrint;
    
    function createBar(label, className, value, max) {
      let wrapper = document.createElement("div");
      wrapper.classList.add("bar-wrapper");

      let title = document.createElement("span");
      title.textContent = label + ": " + value;

      let bar = document.createElement("div");
      bar.classList.add("bar");

      let fill = document.createElement("div");
      fill.classList.add("bar-fill");
      fill.classList.add("bar-" + className);

      let percent = Math.min((value / max) * 100, 100);
      fill.style.maxWidth = percent + "%";

      bar.appendChild(fill);
      wrapper.appendChild(title);
      wrapper.appendChild(bar);

      return wrapper;
    }
    container.appendChild(name);
    container.appendChild(time);

    if (rawTime.years > 0) {
      let yearsBar = createBar("Roky", "years",rawTime.years, 10);
      container.appendChild(yearsBar);
    }
    if (rawTime.months > 0) {
      let monthsBar = createBar("Měsíce", "months",rawTime.months, 12);
      container.appendChild(monthsBar);
    }
    if (rawTime.days > 0) {
      let daysBar = createBar("Dny", "days",rawTime.days, 31);
      container.appendChild(daysBar);
    }
    if (rawTime.hours > 0) {
      let hoursBar = createBar("Hodiny", "hours",rawTime.hours, 24);
      container.appendChild(hoursBar);
    }
    if (rawTime.minutes > 0) {
      let minutesBar = createBar("Minuty", "minutes",rawTime.minutes, 60);
      container.appendChild(minutesBar);
    }
    appsList.appendChild(container);
  }
}
printStats();
setInterval(printStats, 30000);