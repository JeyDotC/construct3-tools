import { TaskNotifierMain } from "./TaskNotifierMain";
import { generateImagePoints, GenerateImagePointsParameters } from "../../tools/image-points-generator";
import { IpcMain, WebContents } from "electron";

function init(
    webContents: WebContents,
    ipcMain: IpcMain
) {
    const tasksNotifier = new TaskNotifierMain(webContents);

    ipcMain.on('generate-image-points', function (event, params: GenerateImagePointsParameters) {
        generateImagePoints({
            ...params,
            tasksNotifier,
        });
    });
}

export { init };