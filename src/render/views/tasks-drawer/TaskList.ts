import { div } from "../../public/justjs/index.js";

type Task = {
  size: number,
  totalProgress: number,
};

type TaskListProps = {
  tasks: Record<string, Task>,
}

function TaskList({ tasks }: TaskListProps) {
  return (
    div({},
      ...Object.entries(tasks).map(([name, { size, totalProgress }]) => {
        const progressPercentage = (totalProgress / size) * 100;

        return div({},
          name,
          div({ class: "progress" },
            div({
              class: `progress-bar ${progressPercentage >= 100 ? "bg-success" : ""}`, 
              role: "progressbar", 
              style: {
                width: `${progressPercentage}%`
              }
            })
          )
        )
      }
      )
    ));
}

export { TaskList }