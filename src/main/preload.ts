import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Send To Main
    generateImagePoints: (commandParams) => ipcRenderer.send('generateImagePoints', commandParams),

    // Receive From Main
    onTaskProgress: (handler) => ipcRenderer.on("onTaskProgress", handler),
    onTasksStarted: (listener) => ipcRenderer.on("onTasksStarted", listener),
});