const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    generateImagePoints: (commandParams) => ipcRenderer.send('generate-image-points', commandParams),
    onImagePointsProgress: (handler) => ipcRenderer.on("progress", handler),
});