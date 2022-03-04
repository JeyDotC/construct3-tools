import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Send To Main
    generateImagePoints: (commandParams) => ipcRenderer.send('generateImagePoints', commandParams),

    // Receive From Main
    onImagePointsProgress: (handler) => ipcRenderer.on("progress", handler),
    onTasksStarted: (listener) => ipcRenderer.on("onTasksStarted", listener),
});