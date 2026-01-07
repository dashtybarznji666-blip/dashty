const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load your index.html file
  win.loadFile('"src/index.ts"')
}

app.whenReady().then(createWindow)