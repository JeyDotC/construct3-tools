import { div } from "../../public/justjs/index.js";

type Task = {
  size: number,
};

type TaskListProps = {
  tasks: Record<string, Task>,
}

function TaskList({ tasks }: TaskListProps){
  return (
    div({}, 
      ...Object.entries(tasks).map(([name, { size }]) => div({}, name ))
    )
  );
}

export { TaskList }