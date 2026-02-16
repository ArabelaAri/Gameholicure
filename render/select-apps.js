function filterApps(apps) {
  const ignoredExact = [
    "Microsoft Update Health Tools",
    "VS JIT Debugger",
    "DiagnosticsHub_CollectionService",
    "Microsoft GameInput",
    "Microsoft Edge WebView2 Runtime",
    "Avast Update Helper",
    "RSA Engine",
    "UXP WebView Support",
    "IntelliTraceProfilerProxy",
    "ClickOnce Bootstrapper Package for Microsoft .NET Framework",
    "Node.js",
    "Microsoft System CLR Types for SQL Server",
    "Microsoft Visual Studio Setup WMI Provider",
    "Microsoft TestPlatform SDK Local Feed",
    "vcpp_crt.redist.clickonce",
    "VS Immersive Activate Helper",
    "RICOH Media Driver",
    "Microsoft Visual Studio Setup Configuration",
    "Synaptics Pointing Device Driver",
    "VLC media player",
    "LSI HDA Modem",
    "HP 3D DriveGuard",
    "Ovládací panel NVIDIA 342.01",
    "Ovl�dac� panel NVIDIA 342.01",
    "Git",
    "Microsoft Teams Meeting Add-in for Microsoft Office"
  ];

  const ignoredStartsWith = [
    "Microsoft Visual C++",
    "Microsoft .NET ",
    "Microsoft ASP.NET Core",
    "Microsoft Windows Desktop",
    "Microsoft.NET.",
    "vs_",
    "icecap_",
    "Microsoft Office",
    "7-Zip ",
    "Java ",
    "IntelliJ IDEA ",
    "Security Update for Microsoft",
    "NVIDIA ",
    "Update for ",
    "Entity Framework ",
    "Aktualizace produktu ",
    "Update for ",
    "Microsoft System CLR Types for SQL Server ",
    "Ovládací panel",
    "Kontrola stavu",
    "Sada Compatibility ",
    "2007 Microsoft Office Suite Service Pack 3"
  ];

  return apps.filter(app => {
    if (ignoredExact.includes(app.name)) return false;
    if (ignoredStartsWith.some(prefix => app.name.startsWith(prefix))) return false;
    if(!app.exe_name || !app.exe_name.toLowerCase().endsWith(".exe")) return false;
    return true;
  });
}

function isFutureDate(dateStr) {
  const today = new Date();
  const inputDate = new Date(dateStr);
  return inputDate > today;
}

apps = [];

async function getInstalledApps() {
  apps = await window.electronAPI.getInstalledApps();
  apps = filterApps(apps);
  console.log(apps);
  let list = document.getElementById("appsContainer");
  for (i = 0; i < apps.length; ++i) {
    const appToSelect = document.createElement('input');
    appToSelect.type = 'checkbox';
    appToSelect.id = apps[i].name; 
    appToSelect.name = apps[i].name;
    appToSelect.value = apps[i].name;
    list.appendChild(appToSelect);

    const label = document.createElement('label');
    label.htmlFor = apps[i].name; 
    label.textContent = apps[i].name;
    list.appendChild(label);
    list.appendChild(document.createElement('br'));
  } 
}

getInstalledApps();


let appsUser = [];    

async function sendApps() {
  appsUser = [];
  currentIndex = 0;
  const checkboxes = document.querySelectorAll('#appsContainer input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const app = apps.find(a => a.name === checkbox.value);
      if (app) {
        appsUser.push({
          name: app.name,
          exe_name: app.exe_name,
          last_opened: ""
        });
      }
    }
  });

  if (appsUser.length === 0) {
    alert("Prosím, vyberte alespoň jednu aplikaci.");
    return;
  }

  showModal();
}

var el = document.getElementById("saveAppsBtn");
if (el.addEventListener) {
  el.addEventListener("click", async () => sendApps()); 
}


const modal = document.getElementById("myModal");
let currentIndex = 0;


function showModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  document.getElementById("appName").innerHTML = appsUser[currentIndex].name;
}

async function getId() {
  const token = await window.electronAPI.getToken();
  const userIdResult = await window.electronAPI.getUserId({ token: token });
  return userIdResult;
}


document.getElementById("saveAppDate").onclick = async  function () {
  const inputDate = document.getElementById("inputDate").value;
  const inputTime = document.getElementById("inputTime").value;
  if (!inputDate) {
    alert("Prosím, vyberte datum posledního spuštění.");
    return;
  }
  else if (isFutureDate(inputDate)) {
    alert("Prosím, vyberte datum, které není v budoucnosti.");
    return;
  }   
  if (inputTime) {
    appsUser[currentIndex].last_opened = inputDate + " " + inputTime + ":00";
    document.getElementById("inputTime").value = "";
  } else {
    appsUser[currentIndex].last_opened = inputDate+ " 00:00:00";
  }
  document.getElementById("inputDate").value = "";

  currentIndex++;

  if (currentIndex < appsUser.length) {
    showModal(); 
  } else {
    console.log(appsUser);
    document.getElementById("myModal").style.display = "none";
    const userIdResult = await getId();
    window.electronAPI.sendSelectedApps({
      apps: appsUser,
      user_id: userIdResult.user_id
    });
    window.electronAPI.loadPage("render/home-page.html");
  }
};

document.getElementById("stepBack").onclick = function () {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = 0;
  }
  showModal();
};