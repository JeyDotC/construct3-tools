import { TaskNotifierMain } from "./TaskNotifierMain";
import { generateImagePoints, GenerateImagePointsParameters, loadImagePointsSpec, saveImagePointsSpec } from "../../tools/image-points-generator";
import { IpcMain, WebContents } from "electron";

function init(
    webContents: WebContents,
    ipcMain: IpcMain
) {
    const tasksNotifier = new TaskNotifierMain(webContents);

    ipcMain.on(generateImagePoints.name, function (event, params: GenerateImagePointsParameters) {
        generateImagePoints({
            ...params,
            tasksNotifier,
        });
    });

    ipcMain.on(saveImagePointsSpec.name, function (event, params: GenerateImagePointsParameters) {
        try {
            saveImagePointsSpec(params);
        } finally {
            webContents.send('saveImagePointsSpec');
        }
    });

    ipcMain.on(loadImagePointsSpec.name, function (event, projectRoot: string, objectType: string) {
        let imagePointsSpec = undefined;
        try {
            imagePointsSpec = loadImagePointsSpec(projectRoot, objectType);
        } finally {
            webContents.send('loadImagePointsSpec', imagePointsSpec);
        }
    });
}

export { init };