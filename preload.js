//most mezi frontendem a Node.js backendem
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadPage: (page) => ipcRenderer.send("load-page", page),
  registerUser: (data) => ipcRenderer.invoke("register-user", data),
  loginUser: (data) => ipcRenderer.invoke("login-user", data),
  getInstalledApps: () => ipcRenderer.invoke("get-installed-apps"),
  setToken: (token) => ipcRenderer.invoke("set-token", token),
  getToken: () => ipcRenderer.invoke("get-token"),
  setUserId: (id) => ipcRenderer.invoke("set-user-id", id),
  getUserId: (token) => ipcRenderer.invoke("get-user-id", token),
  sendSelectedApps: (data) => ipcRenderer.invoke("send-selected-apps", data),
  getStatistics: (id) => ipcRenderer.invoke("get-statistics", id),
  user: (data) => ipcRenderer.invoke("user", data),
  printHistory: () => ipcRenderer.invoke("print-history")
});


