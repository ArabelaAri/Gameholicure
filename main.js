const path = require("path");
const { exec } = require('child_process');
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
//app.setPath("userData", path.join(app.getPath("documents"), "Gameholicure"));
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

/*ipcMain.handle("get-installed-apps", async () => {
  return new Promise((resolve, reject) => {

    const cmd =
      'Get-ItemProperty ' +
      '"HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*", ' +
      '"HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*", ' +
      '"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*" | ' +
      'Where-Object { $_.DisplayName } | ' +
      'ForEach-Object { $_.DisplayName }';

    exec(`powershell -NoProfile -Command "${cmd}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(error);
      }

      const apps = stdout
        .split(/\r?\n/)
        .map(a => a.trim())
        .filter(a => a.length > 0);

      resolve([...new Set(apps)]);
    });
  });
});*/
ipcMain.handle("get-installed-apps", async () => {

  return new Promise((resolve, reject) => {
    const cmd = `
      Get-ItemProperty
        HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,
        HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,
        HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* |
      Where-Object { $_.DisplayName } |
      Select-Object DisplayName, DisplayIcon, InstallLocation |
      ConvertTo-Json
    `;

    exec(`powershell -NoProfile -Command "${cmd}"`, (err, stdout) => {
      if (err) return reject(err);
      const raw = JSON.parse(stdout);
      const apps = raw.map(app => {
        let exe = null;
        if (app.DisplayIcon) {
          exe = app.DisplayIcon
            .split(',')[0]
            .split('\\')
            .pop();
        }
        
        return {
          name: app.DisplayName,
          exe_name: exe,
        };
      });
      resolve(apps);
    });
  });
});



/*const { exec } = require('child_process');

exec('powershell "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName"', (error, stdout, stderr) => {
  if (error) {
    console.error(`Chyba: ${error.message}`);
    return;
  }
  const aplikace = stdout
    .split('\n')
    .map(line => line.trim()) 
    .filter(line => line !== ''); 
  
  console.log('Seznam nainstalovaných aplikací:');
  console.log(aplikace);
});*/