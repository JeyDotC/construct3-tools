import { ImagePointsGenerator } from './image-points-generator/index.js'
import { TasksDrawer } from './tasks-drawer/index.js';

document.getElementById('app').appendChild(ImagePointsGenerator());

document.getElementById('tasks-drawer').appendChild(TasksDrawer());