import { contextBridge, ipcRenderer, ipcMain } from 'electron';

const { TaskNotifierRender } = require('./services/render/TaskNotifierRender');

contextBridge.exposeInMainWorld('electronAPI', {
    generateImagePoints: (commandParams) => ipcRenderer.send('generate-image-points', commandParams),
    onImagePointsProgress: (handler) => ipcRenderer.on("progress", handler),
});

contextBridge.exposeInMainWorld('taskNotifier', new TaskNotifierRender(ipcMain));