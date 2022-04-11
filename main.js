const { app, BrowserWindow, screen } = require('electron')

function createWindow () {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 300,
		height: 300,
		transparent: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true
		},
		type: "Desktop"
		// fullscreen: true
	})
	win.setMenuBarVisibility(false)

	//load the index.html from a url
	win.loadURL('http://localhost:3000');

	win.setMinimizable(false)

	// Open the DevTools.
	// win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.

	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
