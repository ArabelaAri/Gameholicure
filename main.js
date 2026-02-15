const path = require("path");
const { exec } = require('child_process');
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const Store = require("electron-store").default;
const store = new Store();
const psList = require('ps-list');
const { get } = require("http");
const { time } = require("console");
let win;


function createWindow() {
  win = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  /*win.removeMenu(); mnau*/
  win.loadFile(path.join(__dirname, "render", "login.html"));
  win.webContents.openDevTools({ mode: "detach" });
  
  ipcMain.on("load-page", (event, page) => {
    win.loadFile(page);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.handle("register-user", async (event, data) => {
  try {
    const response = await fetch("https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.pswd
      })
    });

    const result = await response.json();
    return result;

  } catch (err) {
    return {
      success: false,
      message: "Chyba připojení k serveru"
    };
  }
});

ipcMain.handle("login-user", async (event, data) => {
  try {
    const response = await fetch("https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: data.username,
        password: data.pswd
      })
    });

    const result = await response.json();
    return result;

  } catch (err) {
    return {
      success: false,
      message: "Chyba připojení k serveru"
    };
  }
});

ipcMain.handle("get-installed-apps", async () => {
  return new Promise((resolve, reject) => {
    const cmd = `
      Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' , 
      'HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' , 
      'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' |
      Where-Object { $_.DisplayName } |
      ForEach-Object { 
        $icon = if ($_.DisplayIcon) { ($_.DisplayIcon -split ',')[0] } else { '' }
        Write-Output ($_.DisplayName + '||' + $icon)
      }
    `.replace(/\n/g, ' ').trim();

    exec(`powershell -NoProfile -Command "${cmd.replace(/"/g, '\\"')}"`, 
      { maxBuffer: 1024 * 1024 * 10 }, 
      (err, stdout, stderr) => {
        if (err) {
          console.error(stderr || err);
          return reject(err);
        }

        const apps = stdout
          .split(/\r?\n/)
          .map(l => l.trim())
          .filter(Boolean)
          .map(line => {
            const [name, iconPath] = line.split("||");
            return {
              name,
              exe_name: iconPath ? iconPath.split('\\').pop() : null
            };
          });
        resolve(apps);
      }
    );
  });
});

ipcMain.handle("set-token", (_, token) => {
  store.set("token", token);
});
ipcMain.handle("get-token", () => {
  return store.get("token");
});
ipcMain.handle("set-user-id", (_, id) => {
  store.set("user_id", id);
});

//for render
ipcMain.handle("get-user-id", async (event, data) => {
  return getUserId(data.token);
})
//for main usage
async function getUserId() {
  const token = store.get("token");
  try {
    const response = await fetch("https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/set-token-id.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: token })
    });

    const result = await response.json();
    return result;

  } catch (err) {
    return {
      success: false,
      message: "Chyba připojení k serveru"
    };
  }
};

ipcMain.handle("send-selected-apps", async (event, data) => {
  try {
    const response = await fetch("https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/select-apps.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apps: data.apps,
        apps_exe: data.apps_exe,
        app_dates: data.app_dates,
        user_id: data.user_id
      })
    });

    const result = await response.json();
    return result;

  } catch (err) {
    return {
      success: false,
      message: "Chyba připojení k serveru"
    };
  }
});

//for render
ipcMain.handle("get-statistics", async (event, id) => {
  return getStatistics(id);
});  
//for main usage
async function getStatistics(id) {
  try {
    const response = await fetch("https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/print-statistics.php", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: id })
    });

    const result = await response.json();
    return result;

  } catch (err) {
    return {
      success: false,
      message: "Chyba připojení k serveru"
    };
  }
};

async function checkRunningApps() {   
    runningNames = [];
    processes = [];
    userIdResult = await getUserId();
    statisticsResult = await getStatistics(userIdResult.user_id);
    if (statisticsResult.success) {
      processes = await psList();
      runningNames = processes.map(p => p.name.toLowerCase());
      for (const app of statisticsResult.appsUser) {
        if (runningNames.includes(app.exe_name.toLowerCase())) {
          const now = new Date();
          var date = now.getDate();
          var month = now.getMonth() + 1; // months are zero-indexed
          var year = now.getFullYear();
          var hours = now.getHours();
          var minutes = now.getMinutes();
          var seconds = now.getSeconds();

          if (date < 10) { date = "0" + date;}
          if (month < 10) { month = "0" + month;}
          if (hours < 10) { hours = "0" + hours;}
          if (minutes < 10) { minutes = "0" + minutes;}
          if (seconds < 10) { seconds = "0" + seconds;}
          var datetime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

          console.log(app.name + " běží " + datetime);
          app.last_opened = datetime;
        }
      };      
    }
}
setInterval(checkRunningApps, 30000);



