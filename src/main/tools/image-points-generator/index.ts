import { TaskNotifierMain } from "../../services/main/TaskNotifierMain";
import { AnimationFolder, ObjectType } from "../types/ObjectTypes";
import { processAnimations } from './processAnimations';

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

function calculateTaskSize({items, subfolders}: AnimationFolder): number {
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
        });
}

export { generateImagePoints };
