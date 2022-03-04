import { WebContents } from "electron";

export type Task = {
    size: number,
};

export type Tasks = Record<string, Task>;

class TaskNotifierMain {
    private webContents: WebContents;

    constructor(webContents: WebContents) {
        this.webContents = webContents;
    }

    tasksStarted(tasks: Tasks){
        this.webContents.send("onTasksStarted", tasks);
    }
}

export { TaskNotifierMain }