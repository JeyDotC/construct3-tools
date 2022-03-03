import { TaskNotifierMain, Tasks } from "../../services/main/TaskNotifierMain";
import { AnimationFolder, ObjectType } from "../types/ObjectTypes";

const fs = require('fs');
const { processAnimations } = require('./processAnimations');

export type MarkerData = {
    name: string,
    marker: [number, number, number],
};

export type GenerateImagePointsParameters = {
    projectRoot: string,
    objectType: string,
    markers: Record<number, MarkerData>
};

export type GenerateImagePointsParametersWithNotifier = {
    tasksNotifier: TaskNotifierMain,
} & GenerateImagePointsParameters;

function extractTasksFromAnimations({items, subfolders}: AnimationFolder, parent?: string): Tasks {
    const normalizedParent = parent || '';
    const tasks = items.reduce((accumulate, { name, frames }) => ({
        ...accumulate,
        [`${normalizedParent}/${name}`]: { size: frames.length },
    }), {});

    const subTasks = subfolders.reduce((accumulate, subFolder) => ({
        ...accumulate,
        ...extractTasksFromAnimations(subFolder, `${normalizedParent}/${subFolder.name}`),
    }), {})

    return {
        ...tasks,
        ...subTasks
    };
}

function generateImagePoints({ projectRoot, objectType, markers, tasksNotifier }: GenerateImagePointsParametersWithNotifier) {
    const spriteRawData = fs.readFileSync(`${projectRoot}/objectTypes/${objectType}.json`);

    const spriteMetadata = JSON.parse(spriteRawData) as ObjectType;

    const { animations } = spriteMetadata;

    const tasks = extractTasksFromAnimations(animations);

    tasksNotifier.tasksStarted(tasks);

    return processAnimations({ animations, markers, projectRoot, objectType })
        .then((animations) => {
            spriteMetadata.animations = animations;
            console.log();
            console.log("Writing image points into project...");
            fs.writeFileSync(`${projectRoot}/objectTypes/${objectType}.json-x`, JSON.stringify(spriteMetadata));
            console.log("DONE.");
        });
}

export { generateImagePoints };
