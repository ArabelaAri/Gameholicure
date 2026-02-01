const path = require("path");
const { exec } = require('child_process');
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const Store = require("electron-store").default;
const store = new Store();
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

ipcMain.handle("get-user-id", async (event, data) => {
  try {
    const response = await fetch("https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/set-token-id.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: data.token })
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

ipcMain.handle("send-selected-apps", async (event, data) => {
  try {
    const response = await fetch("https://student.sspbrno.cz/~kozinova.adela/GAMEHOLICURE/select-apps.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apps: data.apps,
        apps_exe: data.apps_exe
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




