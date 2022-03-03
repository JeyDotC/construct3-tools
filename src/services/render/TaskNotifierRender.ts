import { IpcMain } from "electron";

class TaskNotifierRender {
    private ipcMain: IpcMain;

    constructor(ipcMain: IpcMain) {
        this.ipcMain = ipcMain;
    }

    onTasksStarted(listener) {
        this.ipcMain.on(this.onTasksStarted.name, listener);
    }
}

export { TaskNotifierRender }