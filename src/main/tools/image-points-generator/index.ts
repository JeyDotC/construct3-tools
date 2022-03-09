import { TaskNotifierMain } from "../../services/main/TaskNotifierMain";
import { AnimationFolder, ObjectType } from "../types/ObjectTypes";
import { processAnimations } from './processAnimations';

const path = require('path');

const fs = require('fs');

export type MarkerData = {
    name: string,
    marker: [number, number, number, number],
};

export type GenerateImagePointsParameters = {
    projectRoot: string,
    objectType: string,
    markers: Record<string, MarkerData>
};

export type GenerateImagePointsParametersWithNotifier = {
    tasksNotifier: TaskNotifierMain,
} & GenerateImagePointsParameters;

function calculateTaskSize({ items, subfolders }: AnimationFolder): number {
    const tasks = items.reduce((accumulate, { frames }) => accumulate + frames.length, 0);

    const subTasks = subfolders.reduce((accumulate, subFolder) => (accumulate + calculateTaskSize(subFolder)), 0);

    return (tasks + subTasks);
}

function generateImagePoints({ projectRoot, objectType, markers, tasksNotifier }: GenerateImagePointsParametersWithNotifier) {
    const spriteRawData = fs.readFileSync(`${projectRoot}/objectTypes/${objectType}.json`);

    const spriteMetadata = JSON.parse(spriteRawData) as ObjectType;

    const { animations } = spriteMetadata;

    const size = calculateTaskSize(animations);
    const taskName = `Generate Image Points For ${objectType}`;

    tasksNotifier.tasksStarted({
        [taskName]: { size },
    });

    let totalProgress = 0;

    const onFrameProcessed = () => {
        totalProgress++;
        tasksNotifier.taskProgress(taskName, totalProgress);
    }

    return processAnimations({ animations, markers, projectRoot, objectType, onFrameProcessed })
        .then((animations) => {
            spriteMetadata.animations = animations;

            const taskName = "Writing image points into project...";
            tasksNotifier.tasksStarted({
                [taskName]: { size: 1 },
            });

            fs.writeFileSync(`${projectRoot}/objectTypes/${objectType}.json`, JSON.stringify(spriteMetadata));

            tasksNotifier.taskProgress(taskName, 1);
        }).catch((errors) => console.log(errors));
}

function saveImagePointsSpec({ projectRoot, objectType, markers }: GenerateImagePointsParameters) {
    const dir =  path.join(projectRoot, '.c3-tools');
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    
    const file = path.join(dir, `${objectType}.json`)
    const markersData = JSON.stringify(markers);

    fs.writeFileSync(file, markersData);
}

function loadImagePointsSpec(projectRoot: string, objectType: string): Record<string, MarkerData> | undefined {
    const file = path.join(projectRoot, '.c3-tools', `${objectType}.json`);
    console.log(file);
    if (!fs.existsSync(file)) {
        return undefined;
    }

    const rawFileData = fs.readFileSync(file);

    return JSON.parse(rawFileData);
}

export { generateImagePoints, saveImagePointsSpec, loadImagePointsSpec };
