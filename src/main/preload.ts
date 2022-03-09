import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Send To Main
    generateImagePoints: (commandParams) => ipcRenderer.send('generateImagePoints', commandParams),
    saveImagePointsSpec: (commandParams) => ipcRenderer.send('saveImagePointsSpec', commandParams),
    loadImagePointsSpec: (...commandParams) => ipcRenderer.send('loadImagePointsSpec', ...commandParams),

    // Receive From Main
    onTaskProgress: (handler) => ipcRenderer.on("onTaskProgress", handler),
    onTasksStarted: (listener) => ipcRenderer.on("onTasksStarted", listener),
    onSaveImagePointsSpec: (listener) => ipcRenderer.on("saveImagePointsSpec", listener),
    onLoadImagePointsSpec: (listener) => ipcRenderer.on("loadImagePointsSpec", listener),
});